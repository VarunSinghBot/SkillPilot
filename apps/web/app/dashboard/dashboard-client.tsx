"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { CareerCard } from "@/components/dashboard/career-card";
import { CreateCareerModal } from "@/components/dashboard/create-career-modal";
import { deleteCareerPlan, renameCareerPlan } from "@/app/actions/career";
import type { CareerCardData } from "@skillpilot/types";

interface DashboardClientProps {
    initialPlans: CareerCardData[];
    user: { name?: string | null; email?: string | null };
}

export function DashboardClient({ initialPlans, user }: DashboardClientProps) {
    const [plans, setPlans] = useState(initialPlans);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPlans = plans.filter((plan) =>
        plan.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        setPlans((prev) => prev.filter((p) => p.id !== id));
        await deleteCareerPlan(id);
    };

    const handleRename = async (id: string, newName: string) => {
        setPlans((prev) =>
            prev.map((p) => (p.id === id ? { ...p, title: newName } : p))
        );
        await renameCareerPlan(id, newName);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-display font-bold mb-2">
                        Welcome back, {user.name?.split(" ")[0] || "there"}! 👋
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage your career paths and track your progress
                    </p>
                </motion.div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search career paths..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="hidden sm:inline">Filter</span>
                    </button>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Path
                    </button>
                </div>
            </div>

            {/* Career Cards Grid */}
            {filteredPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map((plan, index) => (
                        <CareerCard
                            key={plan.id}
                            data={plan}
                            index={index}
                            onDelete={handleDelete}
                            onRename={handleRename}
                        />
                    ))}

                    {/* Add New Card */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: filteredPlans.length * 0.1 }}
                        onClick={() => setIsCreateOpen(true)}
                        className="glass-card border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-500 dark:hover:border-primary-500 p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 flex items-center justify-center transition-colors">
                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            Create New Career Path
                        </span>
                    </motion.button>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
                        <Plus className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">No career paths yet</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                        Start by creating your first career path. Define your goals and let AI help you build a roadmap.
                    </p>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Your First Path
                    </button>
                </motion.div>
            )}

            {/* Create Modal */}
            <CreateCareerModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </div>
    );
}
