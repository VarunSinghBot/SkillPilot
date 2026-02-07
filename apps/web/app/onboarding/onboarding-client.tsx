"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Wand2, ArrowRight, SkipForward } from "lucide-react";
import { completeOnboarding } from "@/app/actions/onboarding";

interface OnboardingClientProps {
    userName: string;
}

export function OnboardingClient({ userName }: OnboardingClientProps) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [goal, setGoal] = useState("");
    const [deadline, setDeadline] = useState("");
    const [useAI, setUseAI] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            const result = await completeOnboarding({
                title: title.trim(),
                goal: goal.trim() || undefined,
                deadline: deadline || undefined,
                useAI,
            });

            router.push(result.planId ? `/career/${result.planId}` : "/dashboard");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = async () => {
        setIsSubmitting(true);
        try {
            await completeOnboarding({ skip: true });
            router.push("/dashboard");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 w-full max-w-2xl"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl gradient-primary shadow-lg shadow-primary-500/20">
                        <Compass className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold">Welcome, {userName}!</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Set your first career goal to personalize your journey.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">
                            Career Title <span className="text-danger-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Full Stack Developer"
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Goal (Optional)</label>
                        <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="What do you want to achieve?"
                            rows={3}
                            className="input-field resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Target Deadline (Optional)</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="input-field"
                            min={new Date().toISOString().split("T")[0]}
                        />
                        {useAI && !deadline && (
                            <p className="text-xs text-slate-500 mt-1">
                                AI will suggest a realistic deadline based on recommended skills.
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                        <div className="p-2 rounded-lg gradient-primary">
                            <Wand2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">AI Auto-Generate</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Add suggested skills and a realistic timeline
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useAI}
                                onChange={(e) => setUseAI(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={isSubmitting}
                            className="btn-secondary flex-1 flex items-center justify-center gap-2"
                        >
                            <SkipForward className="w-4 h-4" />
                            Skip for now
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
