"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@skillpilot/db";
import { CreateCareerPlanSchema } from "@skillpilot/types";
import { suggestSkillsForCareer } from "@skillpilot/ai-engine";

export async function getOnboardingStatus() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { onboarded: true },
    });

    return { onboarded: user?.onboarded ?? false };
}

export async function completeOnboarding(input: {
    title?: string;
    goal?: string;
    deadline?: string;
    useAI?: boolean;
    skip?: boolean;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    if (input.skip) {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { onboarded: true },
        });
        return { planId: null };
    }

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

    if (input.useAI) {
        for (const suggestion of suggestions.slice(0, 6)) {
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

            await prisma.careerSkill.create({
                data: {
                    careerPlanId: plan.id,
                    skillId: skill.id,
                    priority: suggestion.priority === "high" ? 1 : suggestion.priority === "medium" ? 2 : 3,
                },
            });

            await prisma.skillProgress.upsert({
                where: {
                    userId_skillId: {
                        userId: session.user.id,
                        skillId: skill.id,
                    },
                },
                create: {
                    userId: session.user.id,
                    skillId: skill.id,
                    progressPercentage: 0,
                },
                update: {},
            });
        }
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { onboarded: true },
    });

    return { planId: plan.id };
}
