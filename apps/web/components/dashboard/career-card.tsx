"use client";

import { motion } from "framer-motion";
import { Calendar, MoreVertical, Trash2, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type { CareerCardData } from "@skillpilot/types";

interface CareerCardProps {
    data: CareerCardData;
    onDelete: (id: string) => void;
    onRename: (id: string, newName: string) => void;
    index: number;
}

export function CareerCard({ data, onDelete, onRename, index }: CareerCardProps) {
    const router = useRouter();
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
        if (progress >= 75) return "from-success-500 to-success-600";
        if (progress >= 50) return "from-primary-500 to-primary-600";
        if (progress >= 25) return "from-pink-500 to-pink-600";
        return "from-gray-400 to-gray-500";
    };

    const handleCardClick = () => {
        if (isEditing || showMenu) return;
        router.push(`/career/${data.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card-hover card-glow p-6 group relative cursor-pointer"
            onClick={handleCardClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick();
                }
            }}
            role="button"
            tabIndex={0}
        >
            {/* Menu Button */}
            <div className="absolute top-4 right-4 z-10" ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>

                {showMenu && (
                    <div className="absolute right-0 mt-1 w-36 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsEditing(true);
                                setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Edit3 className="w-4 h-4" />
                            Rename
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
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
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="text-xl font-semibold bg-transparent border-b-2 border-primary-500 outline-none w-full mb-2"
                />
            ) : (
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {data.title}
                </h3>
            )}

            {/* Goal */}
            {data.goal && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {data.goal}
                </p>
            )}

            {/* Progress */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{data.progress}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className={`progress-bar-fill bg-gradient-to-r ${getProgressColor(data.progress)}`}
                        style={{ width: `${data.progress}%` }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDeadline(data.deadline)}</span>
                </div>
                <span className="skill-badge text-xs">{data.skillCount} skills</span>
            </div>
        </motion.div>
    );
}
