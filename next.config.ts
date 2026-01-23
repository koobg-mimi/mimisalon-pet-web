import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker builds
  output: 'standalone',
  // Server external packages
  serverExternalPackages: [
    '@react-email/components',
    '@react-email/render',
    'ioredis',
    'redis',
    'bullmq',
    'nodemailer',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**', // Allow all GCS buckets
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Allow unoptimized images in production for GCS URLs
    unoptimized: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
