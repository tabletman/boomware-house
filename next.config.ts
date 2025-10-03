import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable full Next.js features (SSR, ISR, API routes)
  // Note: For GitHub Pages deployment, we'll use a separate build config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Conditional GitHub Pages config
  ...(process.env.DEPLOY_TARGET === 'github-pages' && {
    output: 'export',
    images: {
      unoptimized: true,
    },
    basePath: '/boomware-house',
    assetPrefix: '/boomware-house',
  }),
};

export default nextConfig;
