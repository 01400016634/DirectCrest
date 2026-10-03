import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfkit', 'mongoose', 'nodemailer', 'jspdf', 'stripe'],
  outputFileTracingRoot: process.cwd(),
  experimental: {
    optimizePackageImports: ['lucide-react', 'three', '@react-three/drei', '@react-three/fiber'],
  },

  async rewrites() {
    return [
      {
        source: '/intro',
        destination: '/intro.html',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);