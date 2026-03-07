import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next.js rewrites ilə proxy
  async rewrites() {
    return [
      {
        source: "/api/:path*", // frontend-də /api/ ilə çağırışlar
        destination: "http://khalida06-001-site1.ntempurl.com/api/:path*", // remote backend
      },
    ];
  },
};

export default nextConfig;