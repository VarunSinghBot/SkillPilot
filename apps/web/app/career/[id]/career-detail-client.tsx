"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    Target,
    Plus,
    Sparkles,
    GitCompare,
    BarChart3,
    Clock,
    TrendingUp,
} from "lucide-react";
import { SkillCard } from "@/components/career/skill-card";
import { AddSkillModal } from "@/components/career/add-skill-modal";
import { AnalyticsPanel } from "@/components/career/analytics-panel";
import { AIInsightsPanel } from "@/components/career/ai-insights-panel";
import type { SkillWithProgress } from "@skillpilot/types";

interface CareerDetailClientProps {
    plan: {
        id: string;
        title: string;
        goal: string | null;
        deadline: Date | null;
        createdAt: Date;
        skills: SkillWithProgress[];
        overallProgress: number;
    };
}

export function CareerDetailClient({ plan }: CareerDetailClientProps) {
    const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);

    const formatDate = (date: Date | null) => {
        if (!date) return "No deadline set";
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getDaysRemaining = () => {
        if (!plan.deadline) return null;
        const diff = new Date(plan.deadline).getTime() - Date.now();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const daysRemaining = getDaysRemaining();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold mb-2">{plan.title}</h1>
                        {plan.goal && (
                            <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                {plan.goal}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/compare?planA=${plan.id}`}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <GitCompare className="w-4 h-4" />
                            Compare
                        </Link>
                        <button
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <BarChart3 className="w-4 h-4" />
                            {showAnalytics ? "Hide" : "Show"} Analytics
                        </button>
                        <button
                            onClick={() => setIsAddSkillOpen(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Skill
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
                <StatCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="Overall Progress"
                    value={`${plan.overallProgress}%`}
                    color="primary"
                />
                <StatCard
                    icon={<Sparkles className="w-5 h-5" />}
                    label="Skills"
                    value={plan.skills.length.toString()}
                    color="accent"
                />
                <StatCard
                    icon={<Calendar className="w-5 h-5" />}
                    label="Deadline"
                    value={daysRemaining !== null ? `${daysRemaining} days` : "Not set"}
                    color={daysRemaining !== null && daysRemaining < 30 ? "warning" : "success"}
                />
                <StatCard
                    icon={<Clock className="w-5 h-5" />}
                    label="Time Invested"
                    value={`${Math.round(plan.skills.reduce((sum, s) => sum + s.timeSpent, 0) / 60)}h`}
                    color="success"
                />
            </motion.div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Skills List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Skills</h2>
                        {plan.skills.length > 0 && (
                            <span className="text-sm text-slate-500">
                                {plan.skills.filter((s) => s.progress === 100).length} of {plan.skills.length} completed
                            </span>
                        )}
                    </div>

                    {plan.skills.length > 0 ? (
                        <div className="space-y-4">
                            {plan.skills.map((skill, index) => (
                                <SkillCard key={skill.id} skill={skill} careerPlanId={plan.id} index={index} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-card p-8 text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Plus className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No skills added yet</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Start building your skill set for this career path
                            </p>
                            <button
                                onClick={() => setIsAddSkillOpen(true)}
                                className="btn-primary"
                            >
                                Add Your First Skill
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* AI Insights */}
                    <AIInsightsPanel
                        skills={plan.skills}
                        deadline={plan.deadline}
                        careerTitle={plan.title}
                    />

                    {/* Analytics (conditional) */}
                    {showAnalytics && (
                        <AnalyticsPanel skills={plan.skills} deadline={plan.deadline} />
                    )}
                </div>
            </div>

            {/* Add Skill Modal */}
            <AddSkillModal
                isOpen={isAddSkillOpen}
                onClose={() => setIsAddSkillOpen(false)}
                careerPlanId={plan.id}
                careerTitle={plan.title}
                existingSkillIds={plan.skills.map((s) => s.id)}
            />
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: "primary" | "accent" | "success" | "warning";
}) {
    const colorClasses = {
        primary: "from-primary-500 to-primary-600",
        accent: "from-accent-500 to-accent-600",
        success: "from-success-500 to-success-600",
        warning: "from-warning-500 to-warning-600",
    };

    return (
        <div className="glass-card p-4">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white`}>
                    {icon}
                </div>
                <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
            </div>
        </div>
    );
}
