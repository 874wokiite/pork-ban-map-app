import { Store } from '@/types/store'
import fs from 'fs'
import path from 'path'

/**
 * 神戸豚饅サミット店舗データの構造とバリデーションテスト
 */
describe('Store Data Validation', () => {
  let storesData: { stores: Store[] }

  beforeAll(() => {
    // stores.jsonファイルが存在することを確認
    const storesPath = path.join(process.cwd(), 'public', 'data', 'stores.json')
    expect(fs.existsSync(storesPath)).toBe(true)
    
    // JSONファイルを読み込み
    const fileContent = fs.readFileSync(storesPath, 'utf-8')
    storesData = JSON.parse(fileContent)
  })

  test('stores.jsonが有効なJSON形式であること', () => {
    expect(storesData).toBeDefined()
    expect(storesData.stores).toBeInstanceOf(Array)
  })

  test('最低5店舗のデータが含まれていること', () => {
    expect(storesData.stores.length).toBeGreaterThanOrEqual(5)
  })

  test('各店舗データが必須フィールドを含むこと', () => {
    storesData.stores.forEach((store) => {
      // 必須フィールドの存在確認
      expect(store.id).toBeDefined()
      expect(store.name).toBeDefined()
      expect(store.address).toBeDefined()
      expect(store.coordinates).toBeDefined()
      expect(store.district).toBeDefined()
      expect(store.businessHours).toBeDefined()
      expect(store.price).toBeDefined()
      expect(store.features).toBeDefined()
      expect(store.images).toBeDefined()
      expect(store.googleMapsUrl).toBeDefined()
      expect(store.categories).toBeDefined()

      // 型の確認
      expect(typeof store.id).toBe('string')
      expect(typeof store.name).toBe('string')
      expect(typeof store.address).toBe('string')
      expect(typeof store.district).toBe('string')
      expect(typeof store.businessHours).toBe('string')
      expect(typeof store.price).toBe('number')
      expect(typeof store.googleMapsUrl).toBe('string')
      expect(Array.isArray(store.features)).toBe(true)
      expect(Array.isArray(store.images)).toBe(true)
      expect(Array.isArray(store.categories)).toBe(true)
    })
  })

  test('座標データが有効な神戸市内の値であること', () => {
    storesData.stores.forEach((store) => {
      const { lat, lng } = store.coordinates
      
      // 神戸市の緯度経度範囲（概算）
      expect(lat).toBeGreaterThan(34.6)
      expect(lat).toBeLessThan(34.8)
      expect(lng).toBeGreaterThan(135.0)
      expect(lng).toBeLessThan(135.3)
    })
  })

  test('価格が正の整数であること', () => {
    storesData.stores.forEach((store) => {
      expect(store.price).toBeGreaterThan(0)
      expect(Number.isInteger(store.price)).toBe(true)
    })
  })

  test('featuresが1つ以上含まれていること', () => {
    storesData.stores.forEach((store) => {
      expect(store.features.length).toBeGreaterThan(0)
      store.features.forEach(feature => {
        expect(typeof feature).toBe('string')
        expect(feature.length).toBeGreaterThan(0)
      })
    })
  })

  test('categoriesが有効な値のみ含むこと', () => {
    const validCategories = ['テイクアウト', '店内飲食', '通販']
    
    storesData.stores.forEach((store) => {
      expect(store.categories.length).toBeGreaterThan(0)
      store.categories.forEach(category => {
        expect(validCategories).toContain(category)
      })
    })
  })

  test('imagesが1つ以上含まれていること', () => {
    storesData.stores.forEach((store) => {
      expect(store.images.length).toBeGreaterThan(0)
      store.images.forEach(image => {
        expect(typeof image).toBe('string')
        expect(image.length).toBeGreaterThan(0)
      })
    })
  })

  test('各店舗のIDがユニークであること', () => {
    const ids = storesData.stores.map(store => store.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  test('老祥記が含まれていること', () => {
    const roushouki = storesData.stores.find(store => 
      store.name.includes('老祥記')
    )
    expect(roushouki).toBeDefined()
    if (roushouki) {
      expect(roushouki.district).toBe('中央区')
    }
  })
})