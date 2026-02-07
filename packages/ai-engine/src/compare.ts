import type { ComparisonResult, SkillWithProgress } from "@skillpilot/types";
import { analyzeConflicts } from "./index";

interface CareerPlanForComparison {
    id: string;
    title: string;
    skills: {
        id: string;
        name: string;
        progress: number;
        timeSpent: number;
    }[];
}

export function compareCareerPlans(
    planA: CareerPlanForComparison,
    planB: CareerPlanForComparison,
    availableWeeks: number = 24
): ComparisonResult {
    const skillsA = new Map(planA.skills.map(s => [s.id, s]));
    const skillsB = new Map(planB.skills.map(s => [s.id, s]));

    const commonSkills: { id: string; name: string }[] = [];
    const uniqueToA: { id: string; name: string }[] = [];
    const uniqueToB: { id: string; name: string }[] = [];

    // Find common and unique skills
    for (const [id, skill] of skillsA) {
        if (skillsB.has(id)) {
            commonSkills.push({ id, name: skill.name });
        } else {
            uniqueToA.push({ id, name: skill.name });
        }
    }

    for (const [id, skill] of skillsB) {
        if (!skillsA.has(id)) {
            uniqueToB.push({ id, name: skill.name });
        }
    }

    // Time analysis
    const totalTimeA = planA.skills.reduce((sum, s) => sum + s.timeSpent, 0);
    const totalTimeB = planB.skills.reduce((sum, s) => sum + s.timeSpent, 0);

    // Estimate remaining time (assume 20 hours per skill at 100%)
    const estimateRemaining = (skills: typeof planA.skills) => {
        return skills.reduce((sum, s) => {
            const remainingPercent = 100 - s.progress;
            return sum + (remainingPercent / 100) * 20 * 60; // in minutes
        }, 0);
    };

    // Analyze conflicts if merged
    const allSkills = [
        ...planA.skills.map(s => ({ name: s.name })),
        ...planB.skills.filter(s => !skillsA.has(s.id)).map(s => ({ name: s.name })),
    ];

    const aiInsights = analyzeConflicts(allSkills, availableWeeks);

    return {
        commonSkills,
        uniqueToA,
        uniqueToB,
        timeAnalysis: {
            planA: {
                totalTime: totalTimeA,
                estimatedRemaining: estimateRemaining(planA.skills),
            },
            planB: {
                totalTime: totalTimeB,
                estimatedRemaining: estimateRemaining(planB.skills),
            },
        },
        aiInsights,
    };
}
