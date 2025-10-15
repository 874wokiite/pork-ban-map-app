import { Store } from '../store'

describe('Store型定義', () => {
  it('Store型が正しい必須プロパティを持つ', () => {
    const mockStore: Store = {
      id: 'test-store',
      name: 'テスト店舗',
      address: '〒650-0001 兵庫県神戸市中央区test',
      coordinates: {
        lat: 34.6937,
        lng: 135.5023
      },
      district: '中央区',
      businessHours: '10:00-18:00',
      price: 100,
      features: ['テスト特徴1', 'テスト特徴2'],
      images: ['/test-image.jpg'],
      googleMapsUrl: 'https://maps.google.com/?q=test',
      categories: ['テイクアウト']
    }

    // 型チェック用の関数（コンパイル時にエラーが出ないことを確認）
    const validateStore = (store: Store): boolean => {
      return (
        typeof store.id === 'string' &&
        typeof store.name === 'string' &&
        typeof store.address === 'string' &&
        typeof store.coordinates.lat === 'number' &&
        typeof store.coordinates.lng === 'number' &&
        typeof store.district === 'string' &&
        typeof store.businessHours === 'string' &&
        typeof store.price === 'number' &&
        Array.isArray(store.features) &&
        Array.isArray(store.images) &&
        typeof store.googleMapsUrl === 'string' &&
        Array.isArray(store.categories)
      )
    }

    expect(validateStore(mockStore)).toBe(true)
  })

  it('Store型がオプションプロパティを受け入れる', () => {
    const mockStoreWithOptionals: Store = {
      id: 'test-store-2',
      name: 'テスト店舗2',
      address: '〒650-0002 兵庫県神戸市中央区test2',
      coordinates: {
        lat: 34.6937,
        lng: 135.5023
      },
      district: '中央区',
      businessHours: '10:00-18:00',
      price: 150,
      features: ['特徴1'],
      images: ['/test2.jpg'],
      googleMapsUrl: 'https://maps.google.com/?q=test2',
      categories: ['店内飲食'],
      description: 'テスト店舗の説明',
      phone: '078-123-4567',
      website: 'https://example.com'
    }

    expect(mockStoreWithOptionals.description).toBe('テスト店舗の説明')
    expect(mockStoreWithOptionals.phone).toBe('078-123-4567')
    expect(mockStoreWithOptionals.website).toBe('https://example.com')
  })

  it('categories配列が正しい値のみを受け入れる', () => {
    // TypeScriptの型チェックでコンパイル時にエラーになることを期待
    const validCategories: Store['categories'] = ['テイクアウト', '店内飲食', '通販']
    
    expect(validCategories).toHaveLength(3)
    expect(validCategories).toContain('テイクアウト')
    expect(validCategories).toContain('店内飲食')
    expect(validCategories).toContain('通販')
  })

  it('StoreCategory型が正しく定義されている', () => {
    const categories: Store['categories'] = ['テイクアウト']
    expect(Array.isArray(categories)).toBe(true)
    expect(categories[0]).toBe('テイクアウト')
  })
})