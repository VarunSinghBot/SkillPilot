"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const errorMessages: Record<string, string> = {
        Configuration: "There is a problem with the server configuration.",
        AccessDenied: "You do not have permission to sign in.",
        Verification: "The verification token has expired or has already been used.",
        Default: "An error occurred during authentication.",
    };

    const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

    console.log("[AUTH ERROR PAGE] Error:", error);
    console.log("[AUTH ERROR PAGE] All search params:", Object.fromEntries(searchParams.entries()));

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
                    <p className="mt-2 text-gray-600">{errorMessage}</p>
                    {error && (
                        <div className="mt-4 rounded bg-red-50 p-4 text-left">
                            <p className="text-sm font-semibold text-red-800">Error Code:</p>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/auth/signin"
                        className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Try Again
                    </Link>
                    <Link
                        href="/"
                        className="ml-4 inline-block rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
