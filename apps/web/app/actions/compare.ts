"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@skillpilot/db";
import { CompareCareerPlansSchema, MergeSkillsSchema } from "@skillpilot/types";

export async function getCareerPlanForCompare(planId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const plan = (await prisma.careerPlan.findUnique({
        where: { id: planId, userId: session.user.id },
        include: {
            skills: {
                include: {
                    skill: true,
                },
            },
        },
    })) as {
        id: string;
        title: string;
        skills: { skillId: string; skill: { id: string; name: string } }[];
    } | null;

    if (!plan) throw new Error("Career plan not found");

    const skillIds = plan.skills.map((s) => s.skillId);
    const progress = (await prisma.skillProgress.findMany({
        where: {
            userId: session.user.id,
            skillId: { in: skillIds },
        },
    })) as { skillId: string; progressPercentage: number; totalTimeSpent: number }[];

    const progressMap = new Map(progress.map((p) => [p.skillId, p]));

    return {
        id: plan.id,
        title: plan.title,
        skills: plan.skills.map((cs) => {
            const sp = progressMap.get(cs.skillId);
            return {
                id: cs.skill.id,
                name: cs.skill.name,
                progress: sp?.progressPercentage ?? 0,
                timeSpent: sp?.totalTimeSpent ?? 0,
            };
        }),
    };
}

export async function compareCareerPlansAction(input: { planIdA: string; planIdB: string }) {
    const validated = CompareCareerPlansSchema.parse(input);

    const [planA, planB] = await Promise.all([
        getCareerPlanForCompare(validated.planIdA),
        getCareerPlanForCompare(validated.planIdB),
    ]);

    return { planA, planB };
}

export async function mergeCareerSkills(input: {
    sourceSkillIds: string[];
    targetCareerPlanId?: string;
    newPlanTitle?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const validated = MergeSkillsSchema.parse(input);

    let targetPlanId = validated.targetCareerPlanId;

    if (!targetPlanId) {
        const title = validated.newPlanTitle?.trim() || "Hybrid Career Plan";
        const plan = await prisma.careerPlan.create({
            data: {
                userId: session.user.id,
                title,
            },
        });
        targetPlanId = plan.id;
    } else {
        const existing = await prisma.careerPlan.findUnique({
            where: { id: targetPlanId, userId: session.user.id },
        });
        if (!existing) throw new Error("Target career plan not found");
    }

    if (validated.sourceSkillIds.length === 0) {
        return { targetPlanId, added: 0 };
    }

    await prisma.careerSkill.createMany({
        data: validated.sourceSkillIds.map((skillId) => ({
            careerPlanId: targetPlanId!,
            skillId,
        })),
        skipDuplicates: true,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/career/${targetPlanId}`);

    return { targetPlanId, added: validated.sourceSkillIds.length };
}
