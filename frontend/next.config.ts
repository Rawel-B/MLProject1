import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      { source: '/login', destination: '/sign-in/login' },
    ];
  },
};

export default nextConfig;
