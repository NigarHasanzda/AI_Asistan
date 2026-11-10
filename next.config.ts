import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next.js rewrites ilə proxy
  async rewrites() {
    return [
      {
        source: "/api/:path*", // frontend-də /api/ ilə çağırışlar
        destination: "https://khalida06-002-site1.htempurl.com/api/:path*", // remote backend
      },
      {
        source: "/uploads/:path*", // backend-dən gələn nisbi şəkil yolları
        destination: "https://khalida06-002-site1.htempurl.com/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;