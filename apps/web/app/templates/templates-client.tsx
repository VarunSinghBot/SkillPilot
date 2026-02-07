"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Search,
    ArrowLeft,
    Library,
    Code,
    Brain,
    Palette,
    Smartphone,
    Shield,
    Cloud,
    Plus,
    Clock,
    Check,
} from "lucide-react";
import { createCareerPlanFromTemplate } from "@/app/actions/templates";

const CATEGORY_ICONS: Record<string, typeof Code> = {
    "Web Development": Code,
    "Data & AI": Brain,
    Design: Palette,
    Mobile: Smartphone,
    Infrastructure: Cloud,
    Security: Shield,
};

interface TemplatesClientProps {
    isAuthenticated: boolean;
    templates: {
        id: string;
        name: string;
        description: string | null;
        category: string | null;
        skills: string[];
        estimatedWeeks: number;
    }[];
}

export function TemplatesClient({ isAuthenticated, templates }: TemplatesClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [addedTemplates, setAddedTemplates] = useState<string[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    const categories = useMemo(() => {
        const set = new Set<string>();
        templates.forEach((t) => {
            if (t.category) set.add(t.category);
        });
        return ["All", ...Array.from(set).sort()];
    }, [templates]);

    const filteredTemplates = templates.filter((template) => {
        const description = template.description ?? "";
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddTemplate = async (templateId: string) => {
        if (!isAuthenticated) {
            window.location.href = "/auth/signin";
            return;
        }
        setIsCreating(true);
        try {
            const result = await createCareerPlanFromTemplate(templateId);
            setAddedTemplates((prev) => [...prev, templateId]);
            router.push(`/career/${result.planId}`);
        } finally {
            setIsCreating(false);
        }
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
                        <Library className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-3xl font-display font-bold">Career Templates</h1>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                    Jump-start your career planning with pre-built templates
                </p>
            </motion.div>

            {/* Search & Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 space-y-4"
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-12"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                    ? "bg-primary-500 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Templates Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template, index) => {
                    const Icon = CATEGORY_ICONS[template.category || ""] || Library;
                    const isAdded = addedTemplates.includes(template.id);

                    return (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card-hover p-6 group"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 rounded-xl gradient-primary shadow-lg shadow-primary-500/20">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{template.name}</h3>
                                    <p className="text-sm text-slate-500">{template.category}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {template.description || "No description provided."}
                            </p>

                            {/* Skills Preview */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {template.skills.slice(0, 4).map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {template.skills.length > 4 && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        +{template.skills.length - 4} more
                                    </span>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                    <Clock className="w-4 h-4" />
                                    <span>~{template.estimatedWeeks} weeks</span>
                                </div>
                                <button
                                    onClick={() => handleAddTemplate(template.id)}
                                    disabled={isAdded || isCreating}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isAdded
                                            ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400"
                                            : "bg-primary-500 text-white hover:bg-primary-600"
                                        }`}
                                >
                                    {isAdded ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Added
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Use Template
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
                <div className="text-center py-16">
                    <Library className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-xl font-semibold mb-2">No templates found</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Try adjusting your search or filters
                    </p>
                </div>
            )}
        </div>
    );
}
