"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
    Compass,
    LogIn,
    LogOut,
    User,
    LayoutGrid,
    GitCompare,
    Library,
    Moon,
    Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function Navbar() {
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 rounded-xl bg-gray-900 dark:bg-gray-800 shadow-md group-hover:shadow-lg transition-shadow">
                            <Compass className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                            SkillPilot
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    {status === "authenticated" && (
                        <div className="hidden md:flex items-center gap-1">
                            <NavLink href="/dashboard" icon={<LayoutGrid className="w-4 h-4" />}>
                                Dashboard
                            </NavLink>
                            <NavLink href="/compare" icon={<GitCompare className="w-4 h-4" />}>
                                Compare
                            </NavLink>
                            <NavLink href="/templates" icon={<Library className="w-4 h-4" />}>
                                Templates
                            </NavLink>
                        </div>
                    )}

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {theme === "dark" ? (
                                    <Sun className="w-5 h-5 text-yellow-500" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-600" />
                                )}
                            </button>
                        )}

                        {/* Auth Button */}
                        {status === "loading" ? (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        ) : session ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex items-center gap-2">
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            className="w-8 h-8 rounded-full ring-2 ring-primary-500/50"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {session.user?.name?.split(" ")[0]}
                                    </span>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="btn-ghost flex items-center gap-2 text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn("google")}
                                className="btn-primary flex items-center gap-2 text-sm"
                            >
                                <LogIn className="w-4 h-4" />
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}

function NavLink({
    href,
    icon,
    children,
}: {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
            {icon}
            {children}
        </Link>
    );
}
