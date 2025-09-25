import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/boom-warehouse' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/boom-warehouse' : '',
};

export default nextConfig;
