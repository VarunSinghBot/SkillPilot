"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@skillpilot/db";
import { auth } from "@/lib/auth";

export async function getAllSkills() {
    const skills = await prisma.skill.findMany({
        orderBy: { name: "asc" },
    });
    return skills;
}

export async function getUserSkillProgress() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const progress = await prisma.skillProgress.findMany({
        where: { userId: session.user.id },
        include: { skill: true },
    });

    return progress;
}

export async function addSkillToCareer(careerPlanId: string, skillId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership
    const plan = await prisma.careerPlan.findUnique({
        where: { id: careerPlanId, userId: session.user.id },
    });
    if (!plan) throw new Error("Career plan not found");

    // Add skill to career (creates CareerSkill link)
    await prisma.careerSkill.create({
        data: {
            careerPlanId,
            skillId,
        },
    });

    // Create SkillProgress if it doesn't exist (global per user)
    await prisma.skillProgress.upsert({
        where: {
            userId_skillId: {
                userId: session.user.id,
                skillId,
            },
        },
        create: {
            userId: session.user.id,
            skillId,
            progressPercentage: 0,
        },
        update: {},
    });

    revalidatePath(`/career/${careerPlanId}`);
}

export async function createSkill(input: {
    name: string;
    description?: string;
    category?: string;
}) {
    const skill = await prisma.skill.create({
        data: {
            name: input.name,
            description: input.description,
            category: input.category,
        },
    });

    return skill;
}

export async function addSubSkill(skillId: string, title: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const item = await prisma.skillItem.create({
        data: {
            skillId,
            title,
            isCustom: true,
        },
    });

    return item;
}

export async function toggleSkillItem(skillItemId: string, completed: boolean, timeSpent?: number) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Upsert the completion
    const completion = await prisma.skillItemCompletion.upsert({
        where: {
            skillItemId_userId: {
                skillItemId,
                userId: session.user.id,
            },
        },
        create: {
            skillItemId,
            userId: session.user.id,
            completed,
            completedAt: completed ? new Date() : null,
            timeSpent: timeSpent ?? 0,
        },
        update: {
            completed,
            completedAt: completed ? new Date() : null,
            ...(timeSpent !== undefined && { timeSpent }),
        },
    });

    // Recalculate skill progress
    const skillItem = await prisma.skillItem.findUnique({
        where: { id: skillItemId },
        include: {
            skill: {
                include: {
                    items: true,
                },
            },
        },
    });

    if (skillItem) {
        const allItems = skillItem.skill.items;
        const completions = await prisma.skillItemCompletion.findMany({
            where: {
                userId: session.user.id,
                skillItemId: { in: allItems.map((i: any) => i.id) },
                completed: true,
            },
        });

        const progressPercentage = allItems.length > 0
            ? Math.round((completions.length / allItems.length) * 100)
            : 0;

        const totalTimeSpent = await prisma.skillItemCompletion.aggregate({
            where: {
                userId: session.user.id,
                skillItemId: { in: allItems.map((i: any) => i.id) },
            },
            _sum: {
                timeSpent: true,
            },
        });

        await prisma.skillProgress.upsert({
            where: {
                userId_skillId: {
                    userId: session.user.id,
                    skillId: skillItem.skillId,
                },
            },
            create: {
                userId: session.user.id,
                skillId: skillItem.skillId,
                progressPercentage,
                totalTimeSpent: totalTimeSpent._sum.timeSpent ?? 0,
            },
            update: {
                progressPercentage,
                totalTimeSpent: totalTimeSpent._sum.timeSpent ?? 0,
            },
        });
    }

    return completion;
}

export async function removeSkillFromCareer(careerPlanId: string, skillId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Only remove the CareerSkill link, NOT the SkillProgress
    await prisma.careerSkill.deleteMany({
        where: {
            careerPlanId,
            skillId,
            careerPlan: {
                userId: session.user.id,
            },
        },
    });

    revalidatePath(`/career/${careerPlanId}`);
}
