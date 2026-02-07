"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@skillpilot/db";
import { auth } from "@/lib/auth";
import { CreateCareerPlanSchema, UpdateCareerPlanSchema } from "@skillpilot/types";
import { suggestSkillsForCareer } from "@skillpilot/ai-engine";

export async function getCareerPlans() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const plans = await prisma.careerPlan.findMany({
        where: { userId: session.user.id },
        include: {
            skills: {
                include: {
                    skill: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const allSkillIds = plans.flatMap((plan: any) => plan.skills.map((s: any) => s.skillId));
    const progressRows = await prisma.skillProgress.findMany({
        where: {
            userId: session.user.id,
            skillId: { in: allSkillIds },
        },
    });
    const progressMap = new Map(progressRows.map((row: any) => [row.skillId, row.progressPercentage]));

    // Calculate progress for each plan
    return plans.map((plan: any) => {
        const skillIds = plan.skills.map((s: any) => s.skillId);
        const total = skillIds.reduce((sum: number, id: string) => sum + ((progressMap.get(id) as number) ?? 0), 0);
        const progress = skillIds.length > 0 ? Math.round(total / skillIds.length) : 0;

        return {
            id: plan.id,
            title: plan.title,
            goal: plan.goal,
            deadline: plan.deadline,
            skillCount: plan.skills.length,
            progress,
            createdAt: plan.createdAt,
        };
    });
}

export async function getCareerPlanWithProgress(planId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const plan = await prisma.careerPlan.findUnique({
        where: { id: planId, userId: session.user.id },
        include: {
            skills: {
                include: {
                    skill: {
                        include: {
                            items: true,
                        },
                    },
                },
            },
        },
    });

    if (!plan) throw new Error("Career plan not found");

    // Get user's skill progress
    const skillIds = plan.skills.map((s: any) => s.skillId);
    const skillProgress = await prisma.skillProgress.findMany({
        where: {
            userId: session.user.id,
            skillId: { in: skillIds },
        },
    });

    const progressMap = new Map(skillProgress.map((sp: any) => [sp.skillId, sp]));

    // Get skill item completions
    const skillItemIds = plan.skills.flatMap((s: any) => s.skill.items.map((i: any) => i.id));
    const completions = await prisma.skillItemCompletion.findMany({
        where: {
            userId: session.user.id,
            skillItemId: { in: skillItemIds },
        },
    });
    const completionMap = new Map(completions.map((c: any) => [c.skillItemId, c]));

    // Build response with progress
    const skillsWithProgress = plan.skills.map((cs: any) => {
        const progress = progressMap.get(cs.skillId) as any;
        return {
            id: cs.skill.id,
            name: cs.skill.name,
            description: cs.skill.description,
            category: cs.skill.category,
            progress: progress?.progressPercentage ?? 0,
            timeSpent: progress?.totalTimeSpent ?? 0,
            items: cs.skill.items.map((item: any) => {
                const completion = completionMap.get(item.id) as any;
                return {
                    id: item.id,
                    title: item.title,
                    completed: completion?.completed ?? false,
                    timeSpent: completion?.timeSpent ?? 0,
                };
            }),
        };
    });

    // Calculate overall progress
    const totalProgress = skillsWithProgress.length > 0
        ? Math.round(skillsWithProgress.reduce((sum: number, s: any) => sum + s.progress, 0) / skillsWithProgress.length)
        : 0;

    return {
        ...plan,
        skills: skillsWithProgress,
        overallProgress: totalProgress,
    };
}

export async function createCareerPlan(input: {
    title: string;
    goal?: string;
    deadline?: string;
    useAI?: boolean;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const validated = CreateCareerPlanSchema.parse({
        title: input.title,
        goal: input.goal,
        deadline: input.deadline,
    });

    const suggestions = input.useAI ? suggestSkillsForCareer(validated.title, []) : [];
    const totalWeeks = suggestions.reduce((sum, s) => sum + s.estimatedWeeks, 0);
    const aiDeadline = !validated.deadline && input.useAI && totalWeeks > 0
        ? new Date(Date.now() + totalWeeks * 7 * 24 * 60 * 60 * 1000)
        : null;

    const plan = await prisma.careerPlan.create({
        data: {
            userId: session.user.id,
            title: validated.title,
            goal: validated.goal,
            deadline: validated.deadline ? new Date(validated.deadline) : aiDeadline,
        },
    });

    // If AI is enabled, suggest and add skills
    if (input.useAI) {
        for (const suggestion of suggestions.slice(0, 5)) {
            // Create or find skill
            let skill = await prisma.skill.findUnique({
                where: { name: suggestion.name },
            });

            if (!skill) {
                skill = await prisma.skill.create({
                    data: {
                        name: suggestion.name,
                        description: suggestion.description,
                        category: suggestion.category,
                    },
                });
            }

            // Link to career plan
            await prisma.careerSkill.create({
                data: {
                    careerPlanId: plan.id,
                    skillId: skill.id,
                    priority: suggestion.priority === "high" ? 1 : suggestion.priority === "medium" ? 2 : 3,
                },
            });
        }
    }

    revalidatePath("/dashboard");
    return plan;
}

export async function updateCareerPlan(
    planId: string,
    input: { title?: string; goal?: string; deadline?: string }
) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const validated = UpdateCareerPlanSchema.parse(input);

    const plan = await prisma.careerPlan.update({
        where: { id: planId, userId: session.user.id },
        data: {
            ...(validated.title && { title: validated.title }),
            ...(validated.goal !== undefined && { goal: validated.goal }),
            ...(validated.deadline !== undefined && {
                deadline: validated.deadline ? new Date(validated.deadline) : null,
            }),
        },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/career/${planId}`);
    return plan;
}

export async function deleteCareerPlan(planId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Note: This only deletes the CareerPlan and its CareerSkill links
    // It does NOT delete UserSkill progress - skills persist!
    await prisma.careerPlan.delete({
        where: { id: planId, userId: session.user.id },
    });

    revalidatePath("/dashboard");
}

export async function renameCareerPlan(planId: string, newTitle: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.careerPlan.update({
        where: { id: planId, userId: session.user.id },
        data: { title: newTitle },
    });

    revalidatePath("/dashboard");
}
