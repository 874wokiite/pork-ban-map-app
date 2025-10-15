import { 
  RawStoreData, 
  ValidatedStoreData, 
  CollectionError, 
  AnalysisError,
  Result,
  StoreCollectionRequest,
  StoreCollectionResponse 
} from '../data-collection'

describe('データ収集・分析型定義', () => {
  describe('RawStoreData型', () => {
    it('生の店舗データが正しい構造を持つ', () => {
      const rawData: RawStoreData = {
        id: 'test-store',
        name: 'テスト店舗',
        address: '〒650-0001 神戸市中央区test',
        coordinates: { lat: 34.6937, lng: 135.5023 },
        district: '中央区',
        businessHours: '10:00-18:00',
        price: 100,
        features: ['特徴1'],
        categories: ['テイクアウト'],
        sourceUrl: 'https://example.com/store'
      }

      expect(rawData.id).toBe('test-store')
      expect(rawData.sourceUrl).toBe('https://example.com/store')
    })
  })

  describe('Result型', () => {
    it('成功結果を正しく表現する', () => {
      const successResult: Result<string, Error> = {
        success: true,
        data: 'test data'
      }

      expect(successResult.success).toBe(true)
      expect(successResult.data).toBe('test data')
      expect('error' in successResult).toBe(false)
    })

    it('エラー結果を正しく表現する', () => {
      const errorResult: Result<string, Error> = {
        success: false,
        error: new Error('test error')
      }

      expect(errorResult.success).toBe(false)
      expect(errorResult.error.message).toBe('test error')
      expect('data' in errorResult).toBe(false)
    })
  })

  describe('CollectionError型', () => {
    it('データ収集エラーが正しい構造を持つ', () => {
      const error: CollectionError = {
        type: 'NETWORK_ERROR',
        message: 'ネットワークエラーが発生しました',
        storeId: 'test-store',
        timestamp: '2025-10-15T12:00:00Z',
        details: { statusCode: 404 }
      }

      expect(error.type).toBe('NETWORK_ERROR')
      expect(error.storeId).toBe('test-store')
      expect(error.details?.statusCode).toBe(404)
    })
  })

  describe('AnalysisError型', () => {
    it('AI分析エラーが正しい構造を持つ', () => {
      const error: AnalysisError = {
        type: 'API_LIMIT_EXCEEDED',
        message: 'API制限に達しました',
        storeId: 'test-store',
        timestamp: '2025-10-15T12:00:00Z',
        retryAfter: 3600
      }

      expect(error.type).toBe('API_LIMIT_EXCEEDED')
      expect(error.retryAfter).toBe(3600)
    })
  })

  describe('StoreCollectionRequest型', () => {
    it('店舗収集リクエストが正しい構造を持つ', () => {
      const request: StoreCollectionRequest = {
        storeIds: ['store1', 'store2'],
        includeReviews: true,
        analysisDepth: 'detailed'
      }

      expect(request.storeIds).toHaveLength(2)
      expect(request.includeReviews).toBe(true)
      expect(request.analysisDepth).toBe('detailed')
    })
  })

  describe('StoreCollectionResponse型', () => {
    it('店舗収集レスポンスが正しい構造を持つ', () => {
      const response: StoreCollectionResponse = {
        stores: [],
        collectionMetadata: {
          timestamp: '2025-10-15T12:00:00Z',
          successCount: 5,
          errorCount: 1,
          errors: []
        }
      }

      expect(response.collectionMetadata.successCount).toBe(5)
      expect(response.collectionMetadata.errorCount).toBe(1)
    })
  })
})