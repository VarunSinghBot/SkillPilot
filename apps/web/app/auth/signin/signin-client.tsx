"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Compass, LogIn } from "lucide-react";

export function SignInClient() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 w-full max-w-md"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl gradient-primary shadow-lg shadow-primary-500/20">
                        <Compass className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold">Welcome to SkillPilot</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Sign in to continue your career journey.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => signIn("google")}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    <LogIn className="w-4 h-4" />
                    Continue with Google
                </button>

                <div className="mt-6 text-center text-sm text-slate-500">
                    <Link href="/" className="hover:text-primary-600">
                        Back to home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
