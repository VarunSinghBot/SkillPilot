/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@skillpilot/db", "@skillpilot/types", "@skillpilot/ai-engine", "@repo/ui"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },
};

export default nextConfig;
