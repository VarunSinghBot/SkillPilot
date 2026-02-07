import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@skillpilot/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "database", // Use database sessions with adapter
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    debug: true, // Enable debug logging
    trustHost: true, // Required for CSRF protection in development
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            console.log("[AUTH DEBUG] Session Callback - user:", user);
            console.log("[AUTH DEBUG] Session Callback - session:", session);
            
            // Pass user ID from database user to session
            if (session.user && user) {
                session.user.id = user.id;
                console.log("[AUTH DEBUG] Added user.id to session.user:", user.id);
            }
            return session;
        },
        signIn: async ({ user, account, profile }) => {
            console.log("[AUTH DEBUG] SignIn Callback");
            console.log("[AUTH DEBUG] SignIn - user:", user);
            console.log("[AUTH DEBUG] SignIn - account:", account);
            console.log("[AUTH DEBUG] SignIn - profile:", profile);
            return true;
        },
    },
    events: {
        async signIn(message) {
            console.log("[AUTH EVENT] signIn:", message);
        },
        async signOut(message) {
            console.log("[AUTH EVENT] signOut:", message);
        },
        async createUser(message) {
            console.log("[AUTH EVENT] createUser:", message);
        },
        async linkAccount(message) {
            console.log("[AUTH EVENT] linkAccount:", message);
        },
        async session(message) {
            console.log("[AUTH EVENT] session:", message);
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
});
