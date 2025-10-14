/**
 * Google Maps API統合テスト
 */

import { isGoogleMapsAvailable, waitForGoogleMaps } from '@/lib/google-maps'

// DOMメソッドのモック
const mockDocument = {
  createElement: jest.fn(),
  querySelector: jest.fn(),
  head: {
    appendChild: jest.fn(),
  },
}

describe('Google Maps API統合', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks()
    
    // document のモック設定
    global.document = mockDocument as unknown as Document
    
    // 環境変数設定
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    // 環境変数クリア
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  })

  test('Google Maps APIが利用可能かチェックできる', () => {
    expect(isGoogleMapsAvailable()).toBe(true) // jest.setup.jsでモック設定済み
  })

  test('地図インスタンスが作成できる', () => {
    const mapElement = document.createElement('div')
    
    const map = new window.google.maps.Map(mapElement, {
      center: { lat: 34.6937, lng: 135.5023 },
      zoom: 12
    })
    
    expect(window.google.maps.Map).toHaveBeenCalledWith(mapElement, {
      center: { lat: 34.6937, lng: 135.5023 },
      zoom: 12
    })
    expect(map).toBeDefined()
  })

  test('マーカーが作成できる', () => {
    const marker = new window.google.maps.Marker({
      position: { lat: 34.6918, lng: 135.1955 },
      title: 'テスト店舗'
    })
    
    expect(window.google.maps.Marker).toHaveBeenCalledWith({
      position: { lat: 34.6918, lng: 135.1955 },
      title: 'テスト店舗'
    })
    expect(marker).toBeDefined()
  })

  test('waitForGoogleMaps が正常に動作する', async () => {
    // Google Maps APIが既に利用可能な場合
    await expect(waitForGoogleMaps()).resolves.toBeUndefined()
  })

  test('環境変数からAPIキーが読み込める', () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    expect(apiKey).toBeDefined()
    expect(apiKey).toBe('test-api-key')
  })
})