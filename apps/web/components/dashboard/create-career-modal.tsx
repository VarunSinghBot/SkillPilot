"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wand2, Loader2 } from "lucide-react";
import { createCareerPlan } from "@/app/actions/career";

interface CreateCareerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateCareerModal({ isOpen, onClose }: CreateCareerModalProps) {
    const [title, setTitle] = useState("");
    const [goal, setGoal] = useState("");
    const [deadline, setDeadline] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [useAI, setUseAI] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            await createCareerPlan({
                title: title.trim(),
                goal: goal.trim() || undefined,
                deadline: deadline || undefined,
                useAI,
            });

            // Reset and close
            setTitle("");
            setGoal("");
            setDeadline("");
            onClose();
        } catch (error) {
            console.error("Failed to create career plan:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
                    >
                        <div className="glass-card p-6 m-4">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Create Career Path</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
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
                                    <label className="block text-sm font-medium mb-1.5">
                                        Goal (Optional)
                                    </label>
                                    <textarea
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        placeholder="What do you want to achieve with this career path?"
                                        rows={3}
                                        className="input-field resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">
                                        Target Deadline (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="input-field"
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                </div>

                                {/* AI Toggle */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                                    <div className="p-2 rounded-lg gradient-primary">
                                        <Wand2 className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">AI Auto-Generate</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Let AI suggest skills and timeline
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={useAI}
                                            onChange={(e) => setUseAI(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !title.trim()}
                                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Path"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
