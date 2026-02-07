import type {
    AISkillSuggestion,
    AIReadinessScore,
    AIConflictAnalysis,
    SkillWithProgress,
    AILLMGuidanceRequest,
    AILLMGuidanceResponse,
} from "@skillpilot/types";

// ============ Skill Suggestion Rules ============
const SKILL_KNOWLEDGE_BASE: Record<string, AISkillSuggestion[]> = {
    "Frontend Developer": [
        { name: "HTML & CSS", description: "Core web markup and styling", category: "Web Fundamentals", estimatedWeeks: 4, priority: "high", reason: "Foundation for all web development" },
        { name: "JavaScript", description: "Core programming language for the web", category: "Programming", estimatedWeeks: 8, priority: "high", reason: "Essential for interactive web applications" },
        { name: "React", description: "Popular UI library for building interfaces", category: "Frameworks", estimatedWeeks: 6, priority: "high", reason: "Most in-demand frontend framework" },
        { name: "TypeScript", description: "Typed JavaScript for better code quality", category: "Programming", estimatedWeeks: 4, priority: "medium", reason: "Industry standard for larger projects" },
        { name: "Next.js", description: "React framework for production", category: "Frameworks", estimatedWeeks: 4, priority: "medium", reason: "Full-stack React capabilities" },
        { name: "CSS Frameworks", description: "Tailwind, Bootstrap, etc.", category: "Styling", estimatedWeeks: 2, priority: "low", reason: "Faster styling workflow" },
    ],
    "Backend Developer": [
        { name: "Node.js", description: "JavaScript runtime for servers", category: "Runtime", estimatedWeeks: 6, priority: "high", reason: "Popular backend runtime" },
        { name: "Databases", description: "SQL and NoSQL databases", category: "Data", estimatedWeeks: 6, priority: "high", reason: "Essential for data persistence" },
        { name: "REST APIs", description: "Design and build RESTful services", category: "Architecture", estimatedWeeks: 4, priority: "high", reason: "Standard API architecture" },
        { name: "Authentication", description: "OAuth, JWT, sessions", category: "Security", estimatedWeeks: 3, priority: "high", reason: "Critical for secure applications" },
        { name: "Docker", description: "Containerization platform", category: "DevOps", estimatedWeeks: 3, priority: "medium", reason: "Industry standard deployment" },
    ],
    "Data Scientist": [
        { name: "Python", description: "Primary language for data science", category: "Programming", estimatedWeeks: 8, priority: "high", reason: "Most used language in data science" },
        { name: "Statistics", description: "Statistical analysis fundamentals", category: "Math", estimatedWeeks: 6, priority: "high", reason: "Foundation for data analysis" },
        { name: "Machine Learning", description: "ML algorithms and models", category: "AI/ML", estimatedWeeks: 10, priority: "high", reason: "Core skill for data scientists" },
        { name: "SQL", description: "Database querying", category: "Data", estimatedWeeks: 4, priority: "high", reason: "Essential for data retrieval" },
        { name: "Data Visualization", description: "Charts, dashboards, storytelling", category: "Visualization", estimatedWeeks: 4, priority: "medium", reason: "Communicate insights effectively" },
    ],
    "Full Stack Developer": [
        { name: "HTML & CSS", description: "Core web markup and styling", category: "Web Fundamentals", estimatedWeeks: 4, priority: "high", reason: "Foundation for all web development" },
        { name: "JavaScript", description: "Core programming language for the web", category: "Programming", estimatedWeeks: 8, priority: "high", reason: "Essential for both frontend and backend" },
        { name: "React", description: "Popular UI library", category: "Frontend", estimatedWeeks: 6, priority: "high", reason: "Most in-demand frontend framework" },
        { name: "Node.js", description: "JavaScript runtime for servers", category: "Backend", estimatedWeeks: 6, priority: "high", reason: "Use JS for full stack" },
        { name: "Databases", description: "SQL and NoSQL", category: "Data", estimatedWeeks: 6, priority: "high", reason: "Essential for data persistence" },
        { name: "Git", description: "Version control", category: "Tools", estimatedWeeks: 2, priority: "high", reason: "Industry standard for collaboration" },
    ],
};

export function suggestSkillsForCareer(
    careerTitle: string,
    existingSkills: string[]
): AISkillSuggestion[] {
    // Find matching career path
    const normalizedTitle = careerTitle.toLowerCase();
    let suggestions: AISkillSuggestion[] = [];

    for (const [career, skills] of Object.entries(SKILL_KNOWLEDGE_BASE)) {
        if (normalizedTitle.includes(career.toLowerCase()) || career.toLowerCase().includes(normalizedTitle)) {
            suggestions = skills;
            break;
        }
    }

    // Default suggestions if no match
    if (suggestions.length === 0) {
        suggestions = SKILL_KNOWLEDGE_BASE["Full Stack Developer"] || [];
    }

    // Filter out existing skills
    const existingLower = existingSkills.map(s => s.toLowerCase());
    return suggestions.filter(s => !existingLower.includes(s.name.toLowerCase()));
}

// ============ Readiness Scoring ============
export function calculateReadinessScore(
    skills: SkillWithProgress[],
    deadline: Date | null
): AIReadinessScore {
    if (skills.length === 0) {
        return {
            score: 0,
            breakdown: { skillsCoverage: 0, timeAllocation: 0, progressRate: 0 },
            insights: ["No skills added yet. Start by adding skills to your career plan."],
            recommendations: ["Add skills relevant to your career goal."],
        };
    }

    // Calculate skills coverage (average progress)
    const avgProgress = skills.reduce((sum, s) => sum + s.progress, 0) / skills.length;
    const skillsCoverage = Math.round(avgProgress);

    // Calculate time allocation score
    const totalTimeSpent = skills.reduce((sum, s) => sum + s.timeSpent, 0);
    const expectedTimePerSkill = 20 * 60; // 20 hours per skill in minutes
    const expectedTotalTime = skills.length * expectedTimePerSkill;
    const timeAllocation = Math.min(100, Math.round((totalTimeSpent / expectedTotalTime) * 100));

    // Calculate progress rate
    let progressRate = 50; // Default
    if (deadline) {
        const now = new Date();
        const totalDuration = deadline.getTime() - now.getTime();
        const daysRemaining = Math.max(1, Math.ceil(totalDuration / (1000 * 60 * 60 * 24)));
        const progressPerDay = avgProgress / Math.max(1, 30 - daysRemaining + 30);
        const projectedProgress = avgProgress + progressPerDay * daysRemaining;
        progressRate = Math.min(100, Math.round(projectedProgress));
    }

    // Overall score (weighted average)
    const score = Math.round(skillsCoverage * 0.5 + timeAllocation * 0.25 + progressRate * 0.25);

    // Generate insights
    const insights: string[] = [];
    const recommendations: string[] = [];

    if (avgProgress < 30) {
        insights.push("You're in the early stages of skill development.");
        recommendations.push("Focus on completing foundational skills first.");
    } else if (avgProgress < 70) {
        insights.push("Good progress! You're building a solid skill set.");
        recommendations.push("Consider deepening expertise in high-priority skills.");
    } else {
        insights.push("Excellent progress! You're well-prepared for this career path.");
        recommendations.push("Start applying your skills through projects or internships.");
    }

    if (totalTimeSpent < expectedTotalTime * 0.3) {
        insights.push("Time investment is below target.");
        recommendations.push("Try to dedicate more consistent time to learning.");
    }

    return {
        score,
        breakdown: { skillsCoverage, timeAllocation, progressRate },
        insights,
        recommendations,
    };
}

// ============ Conflict Analysis ============
export function analyzeConflicts(
    skills: { name: string; estimatedWeeks?: number }[],
    availableWeeks: number
): AIConflictAnalysis {
    const conflicts: AIConflictAnalysis["conflicts"] = [];

    // Calculate total time needed
    const totalWeeksNeeded = skills.reduce((sum, s) => sum + (s.estimatedWeeks || 4), 0);

    if (totalWeeksNeeded > availableWeeks * 1.5) {
        conflicts.push({
            type: "time_overload",
            description: `You need ~${totalWeeksNeeded} weeks but have ${availableWeeks} weeks available.`,
            severity: "high",
            suggestion: "Consider prioritizing fewer skills or extending your deadline.",
        });
    } else if (totalWeeksNeeded > availableWeeks) {
        conflicts.push({
            type: "time_overload",
            description: `Timeline is tight: ${totalWeeksNeeded} weeks needed vs ${availableWeeks} available.`,
            severity: "medium",
            suggestion: "You may need to parallelize learning or increase study time.",
        });
    }

    // Check for prerequisite issues (simplified rule-based)
    const skillNames = skills.map(s => s.name.toLowerCase());
    const prerequisites: Record<string, string[]> = {
        "react": ["javascript", "html & css"],
        "next.js": ["react", "javascript"],
        "machine learning": ["python", "statistics"],
        "node.js": ["javascript"],
        "typescript": ["javascript"],
    };

    for (const [skill, prereqs] of Object.entries(prerequisites)) {
        if (skillNames.includes(skill)) {
            const missing = prereqs.filter(p => !skillNames.includes(p));
            if (missing.length > 0) {
                conflicts.push({
                    type: "missing_prerequisite",
                    description: `${skill} typically requires: ${missing.join(", ")}`,
                    severity: "medium",
                    suggestion: `Consider adding ${missing.join(" and ")} before or alongside ${skill}.`,
                });
            }
        }
    }

    return {
        hasConflicts: conflicts.length > 0,
        conflicts,
    };
}

// ============ LLM-Ready Prompt Builder ============
export function buildLLMGuidancePrompt(input: AILLMGuidanceRequest) {
    const prompt = [
        "You are an AI career guidance assistant.",
        "Return ONLY valid JSON that matches the provided schema.",
        "User goal: " + input.userGoal,
        "Existing skills: " + (input.existingSkills.length > 0 ? input.existingSkills.join(", ") : "none"),
        "Timeline weeks: " + (input.timelineWeeks ?? "unspecified"),
        "Preferences: " + (input.preferences?.length ? input.preferences.join(", ") : "none"),
    ].join("\n");

    const schema = {
        type: "object",
        additionalProperties: false,
        properties: {
            suggestedSkills: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        category: { type: "string" },
                        estimatedWeeks: { type: "number" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        reason: { type: "string" },
                    },
                    required: ["name", "description", "category", "estimatedWeeks", "priority", "reason"],
                    additionalProperties: false,
                },
            },
            suggestedDeadline: { type: "string" },
            priorityNotes: { type: "array", items: { type: "string" } },
            conflicts: {
                type: "object",
                properties: {
                    hasConflicts: { type: "boolean" },
                    conflicts: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                type: { type: "string" },
                                description: { type: "string" },
                                severity: { type: "string" },
                                suggestion: { type: "string" },
                            },
                            required: ["type", "description", "severity", "suggestion"],
                            additionalProperties: false,
                        },
                    },
                },
                required: ["hasConflicts", "conflicts"],
                additionalProperties: false,
            },
        },
        required: ["suggestedSkills", "priorityNotes", "conflicts"],
    };

    return { prompt, schema };
}

export function parseLLMGuidanceResponse(payload: string): AILLMGuidanceResponse {
    return JSON.parse(payload) as AILLMGuidanceResponse;
}

export * from "./compare";
