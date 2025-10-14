/**
 * Netlify設定のテスト
 */

import fs from 'fs'
import path from 'path'

describe('Netlify設定', () => {
  test('netlify.tomlファイルが存在する', () => {
    const netlifyConfigPath = path.join(process.cwd(), 'netlify.toml')
    expect(fs.existsSync(netlifyConfigPath)).toBe(true)
  })

  test('ビルド設定が正しく設定されている', () => {
    const netlifyConfigPath = path.join(process.cwd(), 'netlify.toml')
    const configContent = fs.readFileSync(netlifyConfigPath, 'utf-8')
    
    // ビルドコマンドの確認
    expect(configContent).toContain('command = "npm run build"')
    expect(configContent).toContain('publish = "out"')
  })

  test('Node.jsバージョンが設定されている', () => {
    const netlifyConfigPath = path.join(process.cwd(), 'netlify.toml')
    const configContent = fs.readFileSync(netlifyConfigPath, 'utf-8')
    
    expect(configContent).toContain('NODE_VERSION = "18"')
  })

  test('セキュリティヘッダーが設定されている', () => {
    const netlifyConfigPath = path.join(process.cwd(), 'netlify.toml')
    const configContent = fs.readFileSync(netlifyConfigPath, 'utf-8')
    
    expect(configContent).toContain('X-Frame-Options = "DENY"')
    expect(configContent).toContain('X-XSS-Protection = "1; mode=block"')
    expect(configContent).toContain('X-Content-Type-Options = "nosniff"')
  })
})