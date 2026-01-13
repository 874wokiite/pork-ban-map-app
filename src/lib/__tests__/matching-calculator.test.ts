import {
  calculateMatchScore,
  calculateAndSortMatches
} from '../matching-calculator'
import { ExtendedStore } from '@/types/store'
import { UserPreferences } from '@/types/spectrum'

// テスト用のモックストア作成ヘルパー
const createMockStore = (
  id: string,
  features?: { skinStyle: number; fillingStyle: number; overallTaste: number; size: number }
): ExtendedStore => ({
  id,
  name: `テスト店舗${id}`,
  address: '神戸市中央区',
  coordinates: { lat: 34.69, lng: 135.19 },
  district: '中央区',
  businessHours: '10:00-18:00',
  features: [],
  googleMapsUrl: 'https://maps.google.com',
  categories: ['テイクアウト'],
  dataSource: {
    collectionDate: '2026-01-13',
    sourceUrl: '',
    isEnhanced: features !== undefined
  },
  ...(features && {
    aiAnalysis: {
      features,
      analysisDate: '2026-01-13'
    }
  })
})

describe('calculateMatchScore', () => {
  describe('完全一致のケース', () => {
    it('ユーザーの好みと店舗の値が完全一致すると100%を返す', () => {
      const store = createMockStore('1', {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      })
      const preferences: UserPreferences = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      }

      const score = calculateMatchScore(store, preferences)
      expect(score).toBe(100)
    })
  })

  describe('部分一致のケース', () => {
    it('各軸で1ずつ差があると約89%を返す', () => {
      const store = createMockStore('1', {
        skinStyle: 6,
        fillingStyle: 6,
        overallTaste: 6,
        size: 6
      })
      const preferences: UserPreferences = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      }

      const score = calculateMatchScore(store, preferences)
      // 差分1、最大差分9なので、類似度 = 1 - (1/9) ≈ 0.889
      // 4軸平均で約88.89%
      expect(score).toBeCloseTo(88.89, 1)
    })

    it('各軸で異なる差分がある場合の計算が正しい', () => {
      const store = createMockStore('1', {
        skinStyle: 8,  // 差分3
        fillingStyle: 3, // 差分2
        overallTaste: 7, // 差分2
        size: 2  // 差分3
      })
      const preferences: UserPreferences = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      }

      const score = calculateMatchScore(store, preferences)
      // skinStyle: 1 - (3/9) = 0.667
      // fillingStyle: 1 - (2/9) = 0.778
      // overallTaste: 1 - (2/9) = 0.778
      // size: 1 - (3/9) = 0.667
      // 平均: (0.667 + 0.778 + 0.778 + 0.667) / 4 = 0.7225
      expect(score).toBeCloseTo(72.22, 1)
    })
  })

  describe('最大差分のケース', () => {
    it('各軸で最大差分（9）があると0%を返す', () => {
      const store = createMockStore('1', {
        skinStyle: 10,
        fillingStyle: 10,
        overallTaste: 10,
        size: 10
      })
      const preferences: UserPreferences = {
        skinStyle: 1,
        fillingStyle: 1,
        overallTaste: 1,
        size: 1
      }

      const score = calculateMatchScore(store, preferences)
      expect(score).toBe(0)
    })
  })

  describe('エッジケース', () => {
    it('aiAnalysisデータがない店舗は0を返す', () => {
      const store = createMockStore('1') // aiAnalysisなし
      const preferences: UserPreferences = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      }

      const score = calculateMatchScore(store, preferences)
      expect(score).toBe(0)
    })

    it('境界値（1と10）でも正しく計算される', () => {
      const store = createMockStore('1', {
        skinStyle: 1,
        fillingStyle: 10,
        overallTaste: 1,
        size: 10
      })
      const preferences: UserPreferences = {
        skinStyle: 1,
        fillingStyle: 10,
        overallTaste: 1,
        size: 10
      }

      const score = calculateMatchScore(store, preferences)
      expect(score).toBe(100)
    })
  })
})

describe('calculateAndSortMatches', () => {
  describe('ソート機能', () => {
    it('マッチ度の高い順にソートされる', () => {
      const stores = [
        createMockStore('low', { skinStyle: 10, fillingStyle: 10, overallTaste: 10, size: 10 }),
        createMockStore('high', { skinStyle: 5, fillingStyle: 5, overallTaste: 5, size: 5 }),
        createMockStore('mid', { skinStyle: 7, fillingStyle: 7, overallTaste: 7, size: 7 })
      ]
      const preferences: UserPreferences = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      }

      const results = calculateAndSortMatches(stores, preferences)

      expect(results[0].store.id).toBe('high')
      expect(results[1].store.id).toBe('mid')
      expect(results[2].store.id).toBe('low')
    })

    it('同じマッチ度の店舗の順序が安定している', () => {
      const stores = [
        createMockStore('first', { skinStyle: 5, fillingStyle: 5, overallTaste: 5, size: 5 }),
        createMockStore('second', { skinStyle: 5, fillingStyle: 5, overallTaste: 5, size: 5 })
      ]
      const preferences: UserPreferences = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      }

      const results = calculateAndSortMatches(stores, preferences)

      expect(results[0].matchScore).toBe(100)
      expect(results[1].matchScore).toBe(100)
    })
  })

  describe('フィルタリング機能', () => {
    it('aiAnalysisデータがない店舗は結果から除外される', () => {
      const stores = [
        createMockStore('with-data', { skinStyle: 5, fillingStyle: 5, overallTaste: 5, size: 5 }),
        createMockStore('without-data') // aiAnalysisなし
      ]
      const preferences: UserPreferences = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      }

      const results = calculateAndSortMatches(stores, preferences)

      expect(results).toHaveLength(1)
      expect(results[0].store.id).toBe('with-data')
    })

    it('すべての店舗にaiAnalysisがない場合は空配列を返す', () => {
      const stores = [
        createMockStore('no-data-1'),
        createMockStore('no-data-2')
      ]
      const preferences: UserPreferences = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      }

      const results = calculateAndSortMatches(stores, preferences)

      expect(results).toHaveLength(0)
    })
  })

  describe('結果の形式', () => {
    it('StoreMatchResult形式で結果を返す', () => {
      const stores = [
        createMockStore('test', { skinStyle: 5, fillingStyle: 5, overallTaste: 5, size: 5 })
      ]
      const preferences: UserPreferences = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      }

      const results = calculateAndSortMatches(stores, preferences)

      expect(results[0]).toHaveProperty('store')
      expect(results[0]).toHaveProperty('matchScore')
      expect(results[0].store.id).toBe('test')
      expect(results[0].matchScore).toBe(100)
    })

    it('マッチ度が0-100の範囲内である', () => {
      const stores = [
        createMockStore('1', { skinStyle: 1, fillingStyle: 1, overallTaste: 1, size: 1 }),
        createMockStore('2', { skinStyle: 5, fillingStyle: 5, overallTaste: 5, size: 5 }),
        createMockStore('3', { skinStyle: 10, fillingStyle: 10, overallTaste: 10, size: 10 })
      ]
      const preferences: UserPreferences = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      }

      const results = calculateAndSortMatches(stores, preferences)

      results.forEach(result => {
        expect(result.matchScore).toBeGreaterThanOrEqual(0)
        expect(result.matchScore).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('空配列のケース', () => {
    it('空の店舗配列を渡すと空配列を返す', () => {
      const preferences: UserPreferences = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 5
      }

      const results = calculateAndSortMatches([], preferences)

      expect(results).toHaveLength(0)
    })
  })
})
