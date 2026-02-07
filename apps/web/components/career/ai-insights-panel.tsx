"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, Target, TrendingUp } from "lucide-react";
import { calculateReadinessScore, suggestSkillsForCareer } from "@skillpilot/ai-engine";
import type { SkillWithProgress } from "@skillpilot/types";

interface AIInsightsPanelProps {
    skills: SkillWithProgress[];
    deadline: Date | null;
    careerTitle: string;
}

export function AIInsightsPanel({ skills, deadline, careerTitle }: AIInsightsPanelProps) {
    const readinessScore = useMemo(
        () => calculateReadinessScore(skills, deadline),
        [skills, deadline]
    );

    const suggestions = useMemo(() => {
        const existingNames = skills.map((s) => s.name);
        return suggestSkillsForCareer(careerTitle, existingNames).slice(0, 3);
    }, [careerTitle, skills]);

    const getScoreColor = (score: number) => {
        if (score >= 75) return "text-success-500";
        if (score >= 50) return "text-primary-500";
        if (score >= 25) return "text-warning-500";
        return "text-danger-500";
    };

    const getScoreGradient = (score: number) => {
        if (score >= 75) return "from-success-400 to-success-600";
        if (score >= 50) return "from-primary-400 to-primary-600";
        if (score >= 25) return "from-warning-400 to-warning-600";
        return "from-danger-400 to-danger-600";
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg gradient-primary">
                    <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold">AI Insights</h3>
            </div>

            {/* Readiness Score */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Readiness Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(readinessScore.score)}`}>
                        {readinessScore.score}%
                    </span>
                </div>
                <div className="progress-bar h-3">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${readinessScore.score}%` }}
                        transition={{ duration: 0.8 }}
                        className={`progress-bar-fill bg-gradient-to-r ${getScoreGradient(readinessScore.score)}`}
                    />
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                    {[
                        { label: "Skills", value: readinessScore.breakdown.skillsCoverage },
                        { label: "Time", value: readinessScore.breakdown.timeAllocation },
                        { label: "Pace", value: readinessScore.breakdown.progressRate },
                    ].map((item) => (
                        <div key={item.label} className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <p className="text-lg font-semibold">{item.value}%</p>
                            <p className="text-xs text-slate-500">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insights */}
            {readinessScore.insights.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary-500" />
                        Insights
                    </h4>
                    <ul className="space-y-2">
                        {readinessScore.insights.map((insight, i) => (
                            <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <span className="text-primary-500">•</span>
                                {insight}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Recommendations */}
            {readinessScore.recommendations.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-success-500" />
                        Recommendations
                    </h4>
                    <ul className="space-y-2">
                        {readinessScore.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <span className="text-success-500">→</span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Suggested Skills */}
            {suggestions.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning-500" />
                        Missing Skills
                    </h4>
                    <div className="space-y-2">
                        {suggestions.map((s) => (
                            <div
                                key={s.name}
                                className="text-sm p-2 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800"
                            >
                                <span className="font-medium">{s.name}</span>
                                <span className="text-warning-600 dark:text-warning-400 ml-1">
                                    ({s.priority} priority)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
