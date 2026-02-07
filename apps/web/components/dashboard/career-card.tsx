"use client";

import { motion } from "framer-motion";
import { Calendar, MoreVertical, Trash2, Edit3 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { CareerCardData } from "@skillpilot/types";

interface CareerCardProps {
    data: CareerCardData;
    onDelete: (id: string) => void;
    onRename: (id: string, newName: string) => void;
    index: number;
}

export function CareerCard({ data, onDelete, onRename, index }: CareerCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(data.title);
    const [showMenu, setShowMenu] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSaveTitle = () => {
        if (editedTitle.trim() && editedTitle !== data.title) {
            onRename(data.id, editedTitle.trim());
        } else {
            setEditedTitle(data.title);
        }
        setIsEditing(false);
    };

    const formatDeadline = (date: Date | null) => {
        if (!date) return "No deadline";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 75) return "from-success-400 to-success-600";
        if (progress >= 50) return "from-primary-400 to-primary-600";
        if (progress >= 25) return "from-warning-400 to-warning-600";
        return "from-slate-400 to-slate-600";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card-hover card-glow p-6 group relative"
        >
            {/* Menu Button */}
            <div className="absolute top-4 right-4" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                    <MoreVertical className="w-4 h-4 text-slate-500" />
                </button>

                {showMenu && (
                    <div className="absolute right-0 mt-1 w-36 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-10">
                        <button
                            onClick={() => {
                                setIsEditing(true);
                                setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <Edit3 className="w-4 h-4" />
                            Rename
                        </button>
                        <button
                            onClick={() => {
                                onDelete(data.id);
                                setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <Link href={`/career/${data.id}`} className="block">
                {/* Title */}
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveTitle();
                            if (e.key === "Escape") {
                                setEditedTitle(data.title);
                                setIsEditing(false);
                            }
                        }}
                        onClick={(e) => e.preventDefault()}
                        className="text-xl font-semibold bg-transparent border-b-2 border-primary-500 outline-none w-full mb-2"
                    />
                ) : (
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {data.title}
                    </h3>
                )}

                {/* Goal */}
                {data.goal && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {data.goal}
                    </p>
                )}

                {/* Progress */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-500 dark:text-slate-400">Progress</span>
                        <span className="font-semibold">{data.progress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className={`progress-bar-fill bg-gradient-to-r ${getProgressColor(data.progress)}`}
                            style={{ width: `${data.progress}%` }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDeadline(data.deadline)}</span>
                    </div>
                    <span className="skill-badge text-xs">{data.skillCount} skills</span>
                </div>
            </Link>
        </motion.div>
    );
}
