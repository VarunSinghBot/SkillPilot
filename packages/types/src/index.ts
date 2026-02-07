import { z } from "zod";

// ============ Career Plan ============
export const CreateCareerPlanSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().optional(),
    goal: z.string().optional(),
    deadline: z
        .string()
        .optional()
        .refine((value) => !value || !Number.isNaN(Date.parse(value)), "Invalid deadline"),
});

export const UpdateCareerPlanSchema = CreateCareerPlanSchema.partial();

export type CreateCareerPlanInput = z.infer<typeof CreateCareerPlanSchema>;
export type UpdateCareerPlanInput = z.infer<typeof UpdateCareerPlanSchema>;

// ============ Skill ============
export const CreateSkillSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    category: z.string().optional(),
});

export const UpdateSkillProgressSchema = z.object({
    skillId: z.string(),
    progressPercentage: z.number().min(0).max(100),
    timeSpent: z.number().min(0).optional(),
});

export type CreateSkillInput = z.infer<typeof CreateSkillSchema>;
export type UpdateSkillProgressInput = z.infer<typeof UpdateSkillProgressSchema>;

// ============ Skill Item ============
export const CreateSkillItemSchema = z.object({
    skillId: z.string(),
    title: z.string().min(1).max(200),
    isCustom: z.boolean().default(true),
});

export const ToggleSkillItemSchema = z.object({
    skillItemId: z.string(),
    completed: z.boolean(),
    timeSpent: z.number().min(0).optional(),
});

export type CreateSkillItemInput = z.infer<typeof CreateSkillItemSchema>;
export type ToggleSkillItemInput = z.infer<typeof ToggleSkillItemSchema>;

// ============ Career Skill (Link) ============
export const AddSkillToCareerSchema = z.object({
    careerPlanId: z.string(),
    skillId: z.string(),
    targetProgress: z.number().min(0).max(100).default(100),
    priority: z.number().min(0).default(0),
});

export type AddSkillToCareerInput = z.infer<typeof AddSkillToCareerSchema>;

// ============ Compare & Merge ============
export const CompareCareerPlansSchema = z.object({
    planIdA: z.string(),
    planIdB: z.string(),
});

export const MergeSkillsSchema = z.object({
    sourceSkillIds: z.array(z.string()),
    targetCareerPlanId: z.string().optional(), // If undefined, create new plan
    newPlanTitle: z.string().optional(),
});

export type CompareCareerPlansInput = z.infer<typeof CompareCareerPlansSchema>;
export type MergeSkillsInput = z.infer<typeof MergeSkillsSchema>;

// ============ AI Types ============
export interface AISkillSuggestion {
    name: string;
    description: string;
    category: string;
    estimatedWeeks: number;
    priority: "high" | "medium" | "low";
    reason: string;
}

export interface AIReadinessScore {
    score: number; // 0-100
    breakdown: {
        skillsCoverage: number;
        timeAllocation: number;
        progressRate: number;
    };
    insights: string[];
    recommendations: string[];
}

export interface AIConflictAnalysis {
    hasConflicts: boolean;
    conflicts: {
        type: "time_overload" | "missing_prerequisite" | "skill_overlap";
        description: string;
        severity: "high" | "medium" | "low";
        suggestion: string;
    }[];
}

export interface AILLMGuidanceRequest {
    userGoal: string;
    existingSkills: string[];
    timelineWeeks?: number;
    preferences?: string[];
}

export interface AILLMGuidanceResponse {
    suggestedSkills: AISkillSuggestion[];
    suggestedDeadline?: string;
    priorityNotes: string[];
    conflicts: AIConflictAnalysis;
}

export interface ComparisonResult {
    commonSkills: { id: string; name: string }[];
    uniqueToA: { id: string; name: string }[];
    uniqueToB: { id: string; name: string }[];
    timeAnalysis: {
        planA: { totalTime: number; estimatedRemaining: number };
        planB: { totalTime: number; estimatedRemaining: number };
    };
    aiInsights: AIConflictAnalysis;
}

// ============ Dashboard Types ============
export interface CareerCardData {
    id: string;
    title: string;
    goal: string | null;
    deadline: Date | null;
    progress: number;
    skillCount: number;
    createdAt: Date;
}

export interface SkillWithProgress {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    progress: number;
    timeSpent: number;
    items: {
        id: string;
        title: string;
        completed: boolean;
        timeSpent: number;
    }[];
}
