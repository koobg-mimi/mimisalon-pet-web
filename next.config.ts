import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 1. 빌드 시 로컬 공유 패키지 트랜스파일 설정 (필수)
  transpilePackages: ['@mimisalon/shared'],

  // 2. 타입 에러가 있어도 빌드를 강제로 완료하도록 설정
  typescript: {
    ignoreBuildErrors: true,
  },

  // 3. ESLint 에러가 있어도 빌드를 강제로 완료하도록 설정 (권장)
  eslint: {
    ignoreDuringBuilds: true,
  },

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
