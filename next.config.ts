import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/boomware-house' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/boomware-house' : '',
};

export default nextConfig;
