"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    GitCompare,
    GitMerge,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Clock,
    ArrowRight,
} from "lucide-react";
import { compareCareerPlans } from "@skillpilot/ai-engine";
import { compareCareerPlansAction, mergeCareerSkills } from "@/app/actions/compare";
import type { CareerCardData, ComparisonResult } from "@skillpilot/types";

interface CompareClientProps {
    plans: CareerCardData[];
    initialPlanA?: string;
    initialPlanB?: string;
}

export function CompareClient({ plans, initialPlanA, initialPlanB }: CompareClientProps) {
    const router = useRouter();
    const [selectedA, setSelectedA] = useState<string>(initialPlanA || "");
    const [selectedB, setSelectedB] = useState<string>(initialPlanB || "");
    const [comparison, setComparison] = useState<ComparisonResult | null>(null);
    const [isComparing, setIsComparing] = useState(false);
    const [mergeSkills, setMergeSkills] = useState<{ id: string; name: string }[]>([]);
    const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
    const [mergeTarget, setMergeTarget] = useState<"new" | "existing">("new");
    const [newPlanTitle, setNewPlanTitle] = useState("");
    const [targetPlanId, setTargetPlanId] = useState<string>("");
    const [isMerging, setIsMerging] = useState(false);

    const handleCompare = useCallback(async () => {
        if (!selectedA || !selectedB) return;

        setIsComparing(true);
        try {
            const { planA, planB } = await compareCareerPlansAction({
                planIdA: selectedA,
                planIdB: selectedB,
            });

            const result = compareCareerPlans(planA, planB, 24);
            setComparison(result);

            const skillMap = new Map<string, { id: string; name: string }>();
            for (const skill of planA.skills) {
                skillMap.set(skill.id, { id: skill.id, name: skill.name });
            }
            for (const skill of planB.skills) {
                if (!skillMap.has(skill.id)) {
                    skillMap.set(skill.id, { id: skill.id, name: skill.name });
                }
            }

            const mergedSkills = Array.from(skillMap.values()).sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setMergeSkills(mergedSkills);
            setSelectedSkillIds(mergedSkills.map((s) => s.id));
        } finally {
            setIsComparing(false);
        }
    }, [selectedA, selectedB]);

    useEffect(() => {
        if (initialPlanA) setSelectedA(initialPlanA);
        if (initialPlanB) setSelectedB(initialPlanB);
    }, [initialPlanA, initialPlanB]);

    useEffect(() => {
        if (selectedA && selectedB && !comparison) {
            handleCompare();
        }
    }, [selectedA, selectedB, comparison, handleCompare]);

    const toggleSkillSelection = (skillId: string) => {
        setSelectedSkillIds((prev) =>
            prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
        );
    };

    const handleMerge = async () => {
        if (selectedSkillIds.length === 0) return;

        setIsMerging(true);
        try {
            const result = await mergeCareerSkills({
                sourceSkillIds: selectedSkillIds,
                targetCareerPlanId: mergeTarget === "existing" ? targetPlanId || undefined : undefined,
                newPlanTitle: mergeTarget === "new" ? newPlanTitle : undefined,
            });

            if (result.targetPlanId) {
                router.push(`/career/${result.targetPlanId}`);
            }
        } finally {
            setIsMerging(false);
        }
    };

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    };

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

                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl gradient-primary">
                        <GitCompare className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-3xl font-display font-bold">Compare Career Paths</h1>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                    Analyze differences and find the best path forward
                </p>
            </motion.div>

            {/* Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 mb-8"
            >
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Plan A */}
                    <div>
                        <label className="block text-sm font-medium mb-2">First Career Path</label>
                        <select
                            value={selectedA}
                            onChange={(e) => setSelectedA(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Select a career path...</option>
                            {plans.map((plan) => (
                                <option key={plan.id} value={plan.id} disabled={plan.id === selectedB}>
                                    {plan.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Plan B */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Second Career Path</label>
                        <select
                            value={selectedB}
                            onChange={(e) => setSelectedB(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Select a career path...</option>
                            {plans.map((plan) => (
                                <option key={plan.id} value={plan.id} disabled={plan.id === selectedA}>
                                    {plan.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleCompare}
                        disabled={!selectedA || !selectedB || isComparing}
                        className="btn-primary flex items-center gap-2"
                    >
                        <GitCompare className="w-5 h-5" />
                        Compare Paths
                    </button>
                </div>
            </motion.div>

            {/* Comparison Results */}
            {comparison && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Skills Comparison */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Common Skills */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="w-5 h-5 text-success-500" />
                                <h3 className="font-semibold">Common Skills</h3>
                                <span className="ml-auto skill-badge">{comparison.commonSkills.length}</span>
                            </div>
                            <div className="space-y-2">
                                {comparison.commonSkills.length > 0 ? (
                                    comparison.commonSkills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="p-2 rounded-lg bg-success-50 dark:bg-success-900/20 text-sm"
                                        >
                                            {skill.name}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">No common skills</p>
                                )}
                            </div>
                        </div>

                        {/* Unique to A */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <XCircle className="w-5 h-5 text-primary-500" />
                                <h3 className="font-semibold">
                                    Only in {plans.find((p) => p.id === selectedA)?.title || "Path A"}
                                </h3>
                                <span className="ml-auto skill-badge">{comparison.uniqueToA.length}</span>
                            </div>
                            <div className="space-y-2">
                                {comparison.uniqueToA.length > 0 ? (
                                    comparison.uniqueToA.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-sm"
                                        >
                                            {skill.name}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">No unique skills</p>
                                )}
                            </div>
                        </div>

                        {/* Unique to B */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <XCircle className="w-5 h-5 text-accent-500" />
                                <h3 className="font-semibold">
                                    Only in {plans.find((p) => p.id === selectedB)?.title || "Path B"}
                                </h3>
                                <span className="ml-auto skill-badge">{comparison.uniqueToB.length}</span>
                            </div>
                            <div className="space-y-2">
                                {comparison.uniqueToB.length > 0 ? (
                                    comparison.uniqueToB.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="p-2 rounded-lg bg-accent-50 dark:bg-accent-900/20 text-sm"
                                        >
                                            {skill.name}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">No unique skills</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Time Analysis */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-primary-500" />
                            <h3 className="font-semibold">Time Analysis</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <p className="text-sm text-slate-500 mb-1">
                                    {plans.find((p) => p.id === selectedA)?.title || "Path A"}
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatTime(comparison.timeAnalysis.planA.totalTime)}
                                </p>
                                <p className="text-sm text-slate-500">
                                    ~{formatTime(comparison.timeAnalysis.planA.estimatedRemaining)} remaining
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <p className="text-sm text-slate-500 mb-1">
                                    {plans.find((p) => p.id === selectedB)?.title || "Path B"}
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatTime(comparison.timeAnalysis.planB.totalTime)}
                                </p>
                                <p className="text-sm text-slate-500">
                                    ~{formatTime(comparison.timeAnalysis.planB.estimatedRemaining)} remaining
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* AI Conflicts */}
                    {comparison.aiInsights.hasConflicts && (
                        <div className="glass-card p-6 border-warning-500/50">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-5 h-5 text-warning-500" />
                                <h3 className="font-semibold">Potential Conflicts</h3>
                            </div>
                            <div className="space-y-3">
                                {comparison.aiInsights.conflicts.map((conflict, i) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-xl border ${conflict.severity === "high"
                                                ? "bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800"
                                                : conflict.severity === "medium"
                                                    ? "bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800"
                                                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                            }`}
                                    >
                                        <p className="font-medium mb-1">{conflict.description}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {conflict.suggestion}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Merge Options */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <GitMerge className="w-5 h-5 text-primary-500" />
                            <h3 className="font-semibold">Merge Skills</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium mb-2">Select skills to merge</p>
                                <div className="grid sm:grid-cols-2 gap-2">
                                    {mergeSkills.map((skill) => (
                                        <label
                                            key={skill.id}
                                            className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedSkillIds.includes(skill.id)}
                                                onChange={() => toggleSkillSelection(skill.id)}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm">{skill.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm font-medium">Merge target</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setMergeTarget("new")}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                            mergeTarget === "new"
                                                ? "bg-primary-500 text-white"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                        }`}
                                    >
                                        New Plan
                                    </button>
                                    <button
                                        onClick={() => setMergeTarget("existing")}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                            mergeTarget === "existing"
                                                ? "bg-primary-500 text-white"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                        }`}
                                    >
                                        Existing Plan
                                    </button>
                                </div>

                                {mergeTarget === "new" ? (
                                    <input
                                        type="text"
                                        value={newPlanTitle}
                                        onChange={(e) => setNewPlanTitle(e.target.value)}
                                        placeholder="New plan title (optional)"
                                        className="input-field"
                                    />
                                ) : (
                                    <select
                                        value={targetPlanId}
                                        onChange={(e) => setTargetPlanId(e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="">Select a plan...</option>
                                        {plans.map((plan) => (
                                            <option key={plan.id} value={plan.id}>
                                                {plan.title}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                <button
                                    onClick={handleMerge}
                                    disabled={
                                        isMerging ||
                                        selectedSkillIds.length === 0 ||
                                        (mergeTarget === "existing" && !targetPlanId)
                                    }
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    <GitMerge className="w-5 h-5" />
                                    {isMerging ? "Merging..." : "Merge Selected Skills"}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {plans.length < 2 && (
                <div className="text-center py-12">
                    <GitCompare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-xl font-semibold mb-2">Need at least 2 career paths</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Create more career paths to compare them
                    </p>
                    <Link href="/dashboard" className="btn-primary">
                        Go to Dashboard
                    </Link>
                </div>
            )}
        </div>
    );
}
