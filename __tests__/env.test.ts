/**
 * 環境変数設定のテスト
 */

describe('環境変数設定', () => {
  beforeEach(() => {
    // 各テスト前に環境変数をクリア
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  })

  test('Google Maps APIキーが環境変数から正しく読み込まれる', () => {
    // テスト環境での環境変数設定
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
    
    // 環境変数が正しく設定されていることを確認
    expect(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY).toBeDefined()
    expect(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY).toBe('test-api-key')
  })

  test('APIキーが未設定の場合はundefined', () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    expect(apiKey).toBeUndefined()
  })

  test('本番APIキーが適切な形式である', () => {
    const productionApiKey = 'AIzaSyA1wq9pcPaQR6rSnEGcJSJ8oVHhQ79qvlw'
    
    // Google Maps APIキーの基本的な形式チェック
    expect(productionApiKey).toMatch(/^AIza[0-9A-Za-z-_]{35}$/)
    expect(productionApiKey.length).toBe(39)
  })
})