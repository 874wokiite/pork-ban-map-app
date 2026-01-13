import { renderHook, act } from '@testing-library/react'
import { useMatchingFilter } from '../useMatchingFilter'
import { ExtendedStore } from '@/types/store'
import { DEFAULT_USER_PREFERENCES } from '@/types/spectrum'

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

describe('useMatchingFilter', () => {
  const mockStores = [
    createMockStore('1', { skinStyle: 8, fillingStyle: 5, overallTaste: 6, size: 3 }),
    createMockStore('2', { skinStyle: 4, fillingStyle: 7, overallTaste: 4, size: 9 }),
    createMockStore('3', { skinStyle: 5, fillingStyle: 5, overallTaste: 5, size: 5 })
  ]

  describe('初期状態', () => {
    it('デフォルトの好み設定で初期化される', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({ stores: mockStores })
      )

      expect(result.current.preferences).toEqual(DEFAULT_USER_PREFERENCES)
    })

    it('カスタム初期設定で初期化できる', () => {
      const initialPreferences = {
        skinStyle: 8,
        fillingStyle: 3,
        overallTaste: 7,
        size: 2
      }

      const { result } = renderHook(() =>
        useMatchingFilter({
          stores: mockStores,
          initialPreferences
        })
      )

      expect(result.current.preferences).toEqual(initialPreferences)
    })

    it('初期状態でマッチング結果が計算されている', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({ stores: mockStores })
      )

      expect(result.current.matchResults).toHaveLength(3)
    })
  })

  describe('好み設定の更新', () => {
    it('setPreferencesで好み設定全体を更新できる', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({ stores: mockStores })
      )

      const newPreferences = {
        skinStyle: 8,
        fillingStyle: 3,
        overallTaste: 7,
        size: 2
      }

      act(() => {
        result.current.setPreferences(newPreferences)
      })

      expect(result.current.preferences).toEqual(newPreferences)
    })

    it('updatePreferenceで個別の軸を更新できる', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({ stores: mockStores })
      )

      act(() => {
        result.current.updatePreference('skinStyle', 8)
      })

      expect(result.current.preferences.skinStyle).toBe(8)
      expect(result.current.preferences.fillingStyle).toBe(5) // 変更されない
    })

    it('好み設定が変更されるとマッチング結果が再計算される', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({ stores: mockStores })
      )

      const initialResults = [...result.current.matchResults]

      act(() => {
        result.current.updatePreference('size', 9) // 店舗2が有利になる
      })

      // マッチ結果の順序が変わっているはず
      expect(result.current.matchResults[0].store.id).not.toBe(initialResults[0].store.id)
    })
  })

  describe('リセット機能', () => {
    it('resetPreferencesで中央値（5）にリセットされる', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({
          stores: mockStores,
          initialPreferences: {
            skinStyle: 8,
            fillingStyle: 3,
            overallTaste: 7,
            size: 2
          }
        })
      )

      act(() => {
        result.current.resetPreferences()
      })

      expect(result.current.preferences).toEqual(DEFAULT_USER_PREFERENCES)
    })
  })

  describe('マッチング結果', () => {
    it('マッチ度の高い順にソートされている', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({ stores: mockStores })
      )

      const scores = result.current.matchResults.map(r => r.matchScore)
      const sortedScores = [...scores].sort((a, b) => b - a)

      expect(scores).toEqual(sortedScores)
    })

    it('aiAnalysisがない店舗は除外される', () => {
      const storesWithMissing = [
        ...mockStores,
        createMockStore('no-data') // aiAnalysisなし
      ]

      const { result } = renderHook(() =>
        useMatchingFilter({ stores: storesWithMissing })
      )

      expect(result.current.matchResults).toHaveLength(3)
      expect(result.current.matchResults.find(r => r.store.id === 'no-data')).toBeUndefined()
    })

    it('完全一致の店舗が100%のマッチ度を持つ', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({ stores: mockStores })
      )

      // 店舗3は中央値（5）なのでデフォルト設定と完全一致
      const store3Result = result.current.matchResults.find(r => r.store.id === '3')
      expect(store3Result?.matchScore).toBe(100)
    })
  })

  describe('空の店舗リスト', () => {
    it('空の店舗リストでもエラーにならない', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({ stores: [] })
      )

      expect(result.current.matchResults).toHaveLength(0)
    })
  })

  describe('最小マッチ度フィルター', () => {
    it('minScoreを指定すると閾値未満の店舗が除外される', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({
          stores: mockStores,
          minScore: 70
        })
      )

      // すべての結果が70%以上
      result.current.matchResults.forEach(r => {
        expect(r.matchScore).toBeGreaterThanOrEqual(70)
      })
    })

    it('デフォルトではminScoreは0（全店舗表示）', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({ stores: mockStores })
      )

      // aiAnalysisがある全店舗が表示される
      expect(result.current.matchResults.length).toBe(3)
    })

    it('minScore=100では完全一致のみ表示', () => {
      const { result } = renderHook(() =>
        useMatchingFilter({
          stores: mockStores,
          minScore: 100
        })
      )

      // 店舗3（中央値）のみが完全一致
      expect(result.current.matchResults.length).toBe(1)
      expect(result.current.matchResults[0].store.id).toBe('3')
    })
  })
})
