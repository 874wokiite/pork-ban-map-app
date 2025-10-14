/**
 * Next.js設定のテスト
 */

import type { NextConfig } from 'next'

describe('Next.js設定', () => {
  test('静的サイト生成が有効になっている', async () => {
    // next.config.tsから設定を動的にimport
    const { default: nextConfig } = await import('../next.config')
    
    expect(nextConfig.output).toBe('export')
  })

  test('Netlify向けの設定が正しく設定されている', async () => {
    const { default: nextConfig } = await import('../next.config')
    
    // 静的サイト生成設定
    expect(nextConfig.output).toBe('export')
    expect(nextConfig.trailingSlash).toBe(true)
    
    // 画像最適化設定（Netlify向け）
    expect(nextConfig.images?.unoptimized).toBe(true)
  })

  test('環境変数がNext.js設定に含まれている', async () => {
    const { default: nextConfig } = await import('../next.config')
    
    expect(nextConfig.env).toBeDefined()
    expect(nextConfig.env?.GOOGLE_MAPS_API_KEY).toBeDefined()
  })
})