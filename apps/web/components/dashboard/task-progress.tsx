"use client";

import { motion } from "framer-motion";

interface TaskProgressProps {
    stats: {
        development: number;
        design: number;
        testing: number;
    };
}

export function TaskProgress({ stats }: TaskProgressProps) {
    const tasks = [
        { label: "Development", value: stats.development, color: "bg-pink-500", textColor: "text-pink-700" },
        { label: "Design", value: stats.design, color: "bg-primary-500", textColor: "text-primary-700" },
        { label: "Testing", value: stats.testing, color: "bg-success-500", textColor: "text-success-700" },
    ];

    const avgProgress = Math.round((stats.development + stats.design + stats.testing) / 3);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="stat-card"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Progress</h3>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{avgProgress}%</span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Average task progress</p>

            <div className="space-y-4">
                {tasks.map((task, index) => (
                    <div key={task.label}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${task.color}`} />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {task.label}
                                </span>
                            </div>
                            <span className={`text-sm font-semibold ${task.textColor}`}>
                                {task.value}%
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${task.value}%` }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                className={`h-full ${task.color} rounded-full`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
