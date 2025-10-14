import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify静的サイト生成設定
  output: 'export',
  trailingSlash: true,
  
  // 画像最適化設定（Netlify向け）
  images: {
    unoptimized: true,
    domains: ['maps.googleapis.com'],
    formats: ['image/webp', 'image/avif']
  },
  
  // 環境変数設定
  env: {
    GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  },
  
  // TypeScript厳密チェック
  typescript: {
    ignoreBuildErrors: false
  },
  
  // ESLint設定
  eslint: {
    ignoreDuringBuilds: false
  }
};

export default nextConfig;
