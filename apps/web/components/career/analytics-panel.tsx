"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Clock, TrendingUp, Target } from "lucide-react";
import type { SkillWithProgress } from "@skillpilot/types";

interface AnalyticsPanelProps {
    skills: SkillWithProgress[];
    deadline: Date | null;
}

export function AnalyticsPanel({ skills, deadline }: AnalyticsPanelProps) {
    const analytics = useMemo(() => {
        const totalTime = skills.reduce((sum, s) => sum + s.timeSpent, 0);
        const avgProgress = skills.length > 0
            ? Math.round(skills.reduce((sum, s) => sum + s.progress, 0) / skills.length)
            : 0;

        // Time per skill
        const timePerSkill = skills.map((s) => ({
            name: s.name,
            time: s.timeSpent,
            progress: s.progress,
        })).sort((a, b) => b.time - a.time);

        // Skills by category
        const byCategory = skills.reduce((acc, s) => {
            const cat = s.category || "Uncategorized";
            if (!acc[cat]) acc[cat] = { count: 0, totalProgress: 0 };
            acc[cat].count++;
            acc[cat].totalProgress += s.progress;
            return acc;
        }, {} as Record<string, { count: number; totalProgress: number }>);

        const categoryStats = Object.entries(byCategory).map(([name, data]) => ({
            name,
            count: data.count,
            avgProgress: Math.round(data.totalProgress / data.count),
        }));

        // Deadline analysis
        let daysRemaining = null;
        let requiredPacePerDay = null;
        if (deadline && avgProgress < 100) {
            const diff = new Date(deadline).getTime() - Date.now();
            daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
            requiredPacePerDay = daysRemaining > 0
                ? ((100 - avgProgress) / daysRemaining).toFixed(1)
                : "∞";
        }

        return {
            totalTime,
            avgProgress,
            timePerSkill,
            categoryStats,
            daysRemaining,
            requiredPacePerDay,
        };
    }, [skills, deadline]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600">
                    <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold">Analytics</h3>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span className="text-xs text-slate-500">Total Time</span>
                    </div>
                    <p className="text-lg font-bold">
                        {Math.floor(analytics.totalTime / 60)}h {analytics.totalTime % 60}m
                    </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-success-500" />
                        <span className="text-xs text-slate-500">Avg Progress</span>
                    </div>
                    <p className="text-lg font-bold">{analytics.avgProgress}%</p>
                </div>
            </div>

            {/* Deadline Pace */}
            {analytics.daysRemaining !== null && (
                <div className="mb-6 p-3 rounded-xl bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
                    <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-warning-600" />
                        <span className="text-sm font-medium text-warning-700 dark:text-warning-400">
                            Deadline in {analytics.daysRemaining} days
                        </span>
                    </div>
                    <p className="text-xs text-warning-600 dark:text-warning-500">
                        Required pace: {analytics.requiredPacePerDay}% per day
                    </p>
                </div>
            )}

            {/* Time per Skill */}
            {analytics.timePerSkill.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3">Time Investment</h4>
                    <div className="space-y-2">
                        {analytics.timePerSkill.slice(0, 5).map((skill) => (
                            <div key={skill.name} className="flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate">{skill.name}</p>
                                </div>
                                <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                                    <div
                                        className="h-full rounded-full gradient-primary"
                                        style={{
                                            width: `${Math.min(100, (skill.time / (analytics.timePerSkill[0]?.time || 1)) * 100)}%`,
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-slate-500 w-12 text-right">
                                    {Math.round(skill.time / 60)}h
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* By Category */}
            {analytics.categoryStats.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-3">By Category</h4>
                    <div className="space-y-2">
                        {analytics.categoryStats.map((cat) => (
                            <div
                                key={cat.name}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800"
                            >
                                <div>
                                    <p className="text-sm font-medium">{cat.name}</p>
                                    <p className="text-xs text-slate-500">{cat.count} skills</p>
                                </div>
                                <span className="text-sm font-semibold">{cat.avgProgress}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
