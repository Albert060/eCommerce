import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["images.unsplash.com", "assets.aceternity.com"],
        remotePatterns: [
            new URL("https://images.unsplash.com/**"),
            new URL("https://assets.aceternity.com/**"),
        ],
    },
};

export default nextConfig;