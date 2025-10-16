import { getStoresData, getStoreById, getStoresByDistrict, getAvailableDistricts } from '@/lib/store-data'

// Mock fetch for testing
global.fetch = jest.fn()

const mockStoresData = {
  stores: [
    {
      id: 'test-store-1',
      name: 'テスト店舗1',
      district: '中央区',
      address: 'テスト住所1',
      coordinates: { lat: 34.69, lng: 135.19 },
      businessHours: '10:00-20:00',
      features: ['テスト特徴'],
      images: ['/test.jpg'],
      googleMapsUrl: 'https://maps.google.com',
      categories: ['テイクアウト']
    },
    {
      id: 'test-store-2',
      name: 'テスト店舗2',
      district: '灘区',
      address: 'テスト住所2',
      coordinates: { lat: 34.71, lng: 135.23 },
      businessHours: '11:00-19:00',
      features: ['テスト特徴2'],
      images: ['/test2.jpg'],
      googleMapsUrl: 'https://maps.google.com',
      categories: ['店内飲食']
    }
  ]
}

describe('Store Data Utilities', () => {
  beforeEach(() => {
    ;(fetch as jest.MockedFunction<typeof fetch>).mockClear()
  })

  describe('getStoresData', () => {
    test('正常に店舗データを取得できること', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStoresData
      } as Response)

      const stores = await getStoresData()
      
      expect(fetch).toHaveBeenCalledWith('/data/stores.json')
      expect(stores).toHaveLength(2)
      expect(stores[0].name).toBe('テスト店舗1')
    })

    test('fetch失敗時に空配列を返すこと', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 404
      } as Response)

      const stores = await getStoresData()
      expect(stores).toEqual([])
    })

    test('ネットワークエラー時に空配列を返すこと', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
        new Error('Network error')
      )

      const stores = await getStoresData()
      expect(stores).toEqual([])
    })
  })

  describe('getStoreById', () => {
    test('存在する店舗IDで店舗を取得できること', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStoresData
      } as Response)

      const store = await getStoreById('test-store-1')
      
      expect(store).toBeDefined()
      expect(store?.name).toBe('テスト店舗1')
      expect(store?.district).toBe('中央区')
    })

    test('存在しない店舗IDでnullを返すこと', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStoresData
      } as Response)

      const store = await getStoreById('nonexistent-store')
      expect(store).toBeNull()
    })
  })

  describe('getStoresByDistrict', () => {
    test('指定した区の店舗のみを取得できること', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStoresData
      } as Response)

      const stores = await getStoresByDistrict('中央区')
      
      expect(stores).toHaveLength(1)
      expect(stores[0].name).toBe('テスト店舗1')
      expect(stores[0].district).toBe('中央区')
    })

    test('存在しない区で空配列を返すこと', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStoresData
      } as Response)

      const stores = await getStoresByDistrict('存在しない区')
      expect(stores).toEqual([])
    })
  })

  describe('getAvailableDistricts', () => {
    test('利用可能な区の一覧をソート済みで取得できること', async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStoresData
      } as Response)

      const districts = await getAvailableDistricts()
      
      expect(districts).toEqual(['中央区', '灘区'])
      expect(districts).toHaveLength(2)
    })

    test('重複する区が除去されること', async () => {
      const dataWithDuplicates = {
        stores: [
          ...mockStoresData.stores,
          {
            ...mockStoresData.stores[0],
            id: 'duplicate-store',
            name: '重複テスト店舗'
          }
        ]
      }

      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => dataWithDuplicates
      } as Response)

      const districts = await getAvailableDistricts()
      expect(districts).toEqual(['中央区', '灘区'])
      expect(districts).toHaveLength(2)
    })
  })
})