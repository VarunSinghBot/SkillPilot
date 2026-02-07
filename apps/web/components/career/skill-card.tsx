"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    ChevronUp,
    Clock,
    CheckCircle2,
    Circle,
    Plus,
    Trash2,
} from "lucide-react";
import { toggleSkillItem, addSubSkill, removeSkillFromCareer } from "@/app/actions/skills";
import type { SkillWithProgress } from "@skillpilot/types";

interface SkillCardProps {
    skill: SkillWithProgress;
    careerPlanId: string;
    index: number;
}

export function SkillCard({ skill, careerPlanId, index }: SkillCardProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [newItemTitle, setNewItemTitle] = useState("");
    const [items, setItems] = useState(skill.items);

    const handleToggleItem = async (itemId: string, currentCompleted: boolean) => {
        // Optimistic update
        setItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, completed: !currentCompleted } : item
            )
        );

        await toggleSkillItem(itemId, !currentCompleted);
        router.refresh();
    };

    const handleAddItem = async () => {
        if (!newItemTitle.trim()) return;

        const newItem = await addSubSkill(skill.id, newItemTitle.trim());
        setItems((prev) => [...prev, { ...newItem, completed: false, timeSpent: 0 }]);
        setNewItemTitle("");
        setIsAddingItem(false);
        router.refresh();
    };

    const handleRemove = async () => {
        if (confirm("Remove this skill from the career path? Your progress will be preserved.")) {
            await removeSkillFromCareer(careerPlanId, skill.id);
            router.refresh();
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 75) return "from-success-400 to-success-600";
        if (progress >= 50) return "from-primary-400 to-primary-600";
        if (progress >= 25) return "from-warning-400 to-warning-600";
        return "from-slate-400 to-slate-600";
    };

    const completedCount = items.filter((i) => i.completed).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card overflow-hidden"
        >
            {/* Header */}
            <div
                className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{skill.name}</h3>
                            {skill.category && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    {skill.category}
                                </span>
                            )}
                        </div>
                        {skill.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                                {skill.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-lg font-bold">{skill.progress}%</p>
                            <p className="text-xs text-slate-500">
                                {completedCount}/{items.length} items
                            </p>
                        </div>
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                    <div className="progress-bar">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.progress}%` }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className={`progress-bar-fill bg-gradient-to-r ${getProgressColor(skill.progress)}`}
                        />
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-200 dark:border-slate-700"
                    >
                        <div className="p-4 space-y-3">
                            {/* Time Spent */}
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {Math.round(skill.timeSpent / 60)}h {skill.timeSpent % 60}m spent
                                </span>
                            </div>

                            {/* Sub-items */}
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleToggleItem(item.id, item.completed)}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group"
                                    >
                                        {item.completed ? (
                                            <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0 group-hover:text-primary-500" />
                                        )}
                                        <span
                                            className={`flex-1 text-sm ${item.completed
                                                    ? "line-through text-slate-400"
                                                    : "text-slate-700 dark:text-slate-300"
                                                }`}
                                        >
                                            {item.title}
                                        </span>
                                        {item.timeSpent > 0 && (
                                            <span className="text-xs text-slate-400">{item.timeSpent}m</span>
                                        )}
                                    </div>
                                ))}

                                {/* Add New Item */}
                                {isAddingItem ? (
                                    <div className="flex items-center gap-2 p-2">
                                        <input
                                            type="text"
                                            value={newItemTitle}
                                            onChange={(e) => setNewItemTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddItem();
                                                if (e.key === "Escape") {
                                                    setIsAddingItem(false);
                                                    setNewItemTitle("");
                                                }
                                            }}
                                            placeholder="Enter sub-skill title..."
                                            className="flex-1 text-sm px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleAddItem}
                                            className="px-3 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600"
                                        >
                                            Add
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAddingItem(true)}
                                        className="flex items-center gap-2 p-2 w-full text-sm text-slate-500 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add sub-skill
                                    </button>
                                )}
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={handleRemove}
                                className="flex items-center gap-2 text-sm text-danger-500 hover:text-danger-600 mt-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Remove from plan
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
