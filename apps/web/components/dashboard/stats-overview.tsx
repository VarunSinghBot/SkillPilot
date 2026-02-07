"use client";

import { motion } from "framer-motion";
import { Briefcase, Target, Users, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    gradient: string;
    delay: number;
}

function StatCard({ title, value, icon, trend, gradient, delay }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="stat-card group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center text-white shadow-lg`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                        trend.isPositive ? 'text-success-600' : 'text-danger-500'
                    }`}>
                        {trend.isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>
            
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
            </p>
            
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                <span className="inline-flex items-center gap-1">
                    ∞ Dynamic of changes
                </span>
                <span className="ml-auto float-right">Monthly</span>
            </div>
        </motion.div>
    );
}

interface StatsOverviewProps {
    stats: {
        activePlans: number;
        totalSkills: number;
        completedSkills: number;
        avgProgress: number;
    };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
                title="Active Career Paths"
                value={stats.activePlans}
                icon={<Briefcase className="w-6 h-6" />}
                trend={{ value: 12, isPositive: false }}
                gradient="gradient-success"
                delay={0}
            />
            
            <StatCard
                title="Total Skills"
                value={stats.totalSkills}
                icon={<Target className="w-6 h-6" />}
                trend={{ value: 23, isPositive: true }}
                gradient="gradient-primary"
                delay={0.1}
            />
            
            <StatCard
                title="Average Progress"
                value={`${stats.avgProgress}%`}
                icon={<Users className="w-6 h-6" />}
                gradient="gradient-pink"
                delay={0.2}
            />
        </div>
    );
}
