"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Plus, Wand2, Loader2 } from "lucide-react";
import { addSkillToCareer, createSkill, getAllSkills } from "@/app/actions/skills";
import { suggestSkillsForCareer } from "@skillpilot/ai-engine";
import type { AISkillSuggestion } from "@skillpilot/types";

interface AddSkillModalProps {
    isOpen: boolean;
    onClose: () => void;
    careerPlanId: string;
    careerTitle: string;
    existingSkillIds: string[];
}

export function AddSkillModal({
    isOpen,
    onClose,
    careerPlanId,
    careerTitle,
    existingSkillIds,
}: AddSkillModalProps) {
    const [tab, setTab] = useState<"existing" | "create" | "ai">("ai");
    const [searchQuery, setSearchQuery] = useState("");
    const [allSkills, setAllSkills] = useState<{ id: string; name: string; category: string | null }[]>([]);
    const [aiSuggestions, setAiSuggestions] = useState<AISkillSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // New skill form
    const [newSkillName, setNewSkillName] = useState("");
    const [newSkillDesc, setNewSkillDesc] = useState("");
    const [newSkillCategory, setNewSkillCategory] = useState("");

    useEffect(() => {
        if (isOpen) {
            // Load existing skills
            getAllSkills().then(setAllSkills);

            // Get AI suggestions
            const existingNames = allSkills
                .filter((s) => existingSkillIds.includes(s.id))
                .map((s) => s.name);
            const suggestions = suggestSkillsForCareer(careerTitle, existingNames);
            setAiSuggestions(suggestions);
        }
    }, [isOpen, careerTitle, existingSkillIds]);

    const filteredSkills = allSkills.filter(
        (skill) =>
            !existingSkillIds.includes(skill.id) &&
            skill.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddExisting = async (skillId: string) => {
        setIsLoading(true);
        try {
            await addSkillToCareer(careerPlanId, skillId);
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNew = async () => {
        if (!newSkillName.trim()) return;
        setIsLoading(true);
        try {
            const skill = await createSkill({
                name: newSkillName.trim(),
                description: newSkillDesc.trim() || undefined,
                category: newSkillCategory.trim() || undefined,
            });
            await addSkillToCareer(careerPlanId, skill.id);
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAISuggestion = async (suggestion: AISkillSuggestion) => {
        setIsLoading(true);
        try {
            // Check if skill exists
            let skill = allSkills.find(
                (s: any) => s.name.toLowerCase() === suggestion.name.toLowerCase()
            );

            if (!skill) {
                skill = await createSkill({
                    name: suggestion.name,
                    description: suggestion.description,
                    category: suggestion.category,
                });
            }

            if (skill) {
                await addSkillToCareer(careerPlanId, skill.id);
                setAiSuggestions((prev) => prev.filter((s) => s.name !== suggestion.name));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[80vh] z-50"
                    >
                        <div className="glass-card m-4 flex flex-col max-h-[80vh]">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-xl font-semibold">Add Skill</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-slate-200 dark:border-slate-700">
                                {[
                                    { id: "ai", label: "AI Suggestions", icon: Wand2 },
                                    { id: "existing", label: "Existing", icon: Search },
                                    { id: "create", label: "Create New", icon: Plus },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTab(t.id as typeof tab)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${tab === t.id
                                                ? "text-primary-600 border-b-2 border-primary-600"
                                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                            }`}
                                    >
                                        <t.icon className="w-4 h-4" />
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {tab === "ai" && (
                                    <div className="space-y-3">
                                        {aiSuggestions.length > 0 ? (
                                            aiSuggestions.map((suggestion) => (
                                                <div
                                                    key={suggestion.name}
                                                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-500/50 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-medium">{suggestion.name}</h4>
                                                                <span
                                                                    className={`text-xs px-2 py-0.5 rounded-full ${suggestion.priority === "high"
                                                                            ? "bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400"
                                                                            : suggestion.priority === "medium"
                                                                                ? "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400"
                                                                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                                        }`}
                                                                >
                                                                    {suggestion.priority}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                                {suggestion.description}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-2">
                                                                ~{suggestion.estimatedWeeks} weeks • {suggestion.reason}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleAddAISuggestion(suggestion)}
                                                            disabled={isLoading}
                                                            className="btn-primary py-2 px-4 text-sm"
                                                        >
                                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-slate-500 py-8">
                                                No more suggestions available
                                            </p>
                                        )}
                                    </div>
                                )}

                                {tab === "existing" && (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search skills..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="input-field pl-10"
                                            />
                                        </div>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {filteredSkills.map((skill) => (
                                                <button
                                                    key={skill.id}
                                                    onClick={() => handleAddExisting(skill.id)}
                                                    disabled={isLoading}
                                                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    <div className="text-left">
                                                        <p className="font-medium">{skill.name}</p>
                                                        {skill.category && (
                                                            <p className="text-xs text-slate-500">{skill.category}</p>
                                                        )}
                                                    </div>
                                                    <Plus className="w-5 h-5 text-primary-500" />
                                                </button>
                                            ))}
                                            {filteredSkills.length === 0 && (
                                                <p className="text-center text-slate-500 py-4">
                                                    No matching skills found
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {tab === "create" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">
                                                Skill Name <span className="text-danger-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={newSkillName}
                                                onChange={(e) => setNewSkillName(e.target.value)}
                                                placeholder="e.g., React"
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">
                                                Description
                                            </label>
                                            <textarea
                                                value={newSkillDesc}
                                                onChange={(e) => setNewSkillDesc(e.target.value)}
                                                placeholder="Brief description..."
                                                rows={2}
                                                className="input-field resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">
                                                Category
                                            </label>
                                            <input
                                                type="text"
                                                value={newSkillCategory}
                                                onChange={(e) => setNewSkillCategory(e.target.value)}
                                                placeholder="e.g., Frontend, Backend, DevOps"
                                                className="input-field"
                                            />
                                        </div>
                                        <button
                                            onClick={handleCreateNew}
                                            disabled={isLoading || !newSkillName.trim()}
                                            className="btn-primary w-full flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4" />
                                                    Create & Add Skill
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
