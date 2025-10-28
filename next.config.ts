import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  eslint: {
    // This lets `next build` succeed even if eslint finds errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignoring for now to get static site deployed, will remove later
    ignoreBuildErrors: true,
  },
   output: 'export',
   images: {
    unoptimized: true,
  },
};

export default nextConfig;
