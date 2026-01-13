/**
 * フィルターマッチング機能の統合テスト
 * フルフロー（フィルター → マッチング → 店舗選択）を検証
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import FilterMatchingModal from '@/components/FilterMatchingModal'
import { ExtendedStore } from '@/types/store'
import { calculateMatchScore, calculateAndSortMatches } from '@/lib/matching-calculator'
import { DEFAULT_USER_PREFERENCES } from '@/types/spectrum'

// テスト用のモックストア作成ヘルパー
const createMockStore = (
  id: string,
  name: string,
  features: { skinStyle: number; fillingStyle: number; overallTaste: number; size: number }
): ExtendedStore => ({
  id,
  name,
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
    isEnhanced: true
  },
  aiAnalysis: {
    features,
    analysisDate: '2026-01-13'
  }
})

// 実際の店舗データに近いテストデータ
const mockStores = [
  createMockStore('roushouki', '老祥記', { skinStyle: 8, fillingStyle: 5, overallTaste: 6, size: 3 }),
  createMockStore('shikohroh', '四興樓', { skinStyle: 4, fillingStyle: 7, overallTaste: 4, size: 9 }),
  createMockStore('sannomiya', '三宮一貫楼', { skinStyle: 4, fillingStyle: 6, overallTaste: 4, size: 7 }),
  createMockStore('perfect', '完全一致店', { skinStyle: 5, fillingStyle: 5, overallTaste: 5, size: 5 })
]

describe('フィルターマッチング機能 統合テスト', () => {
  describe('マッチング計算の正確性', () => {
    it('デフォルト設定で完全一致店舗が100%マッチする', () => {
      const perfectStore = mockStores.find(s => s.id === 'perfect')!
      const score = calculateMatchScore(perfectStore, DEFAULT_USER_PREFERENCES)
      expect(score).toBe(100)
    })

    it('マッチング結果がマッチ度順にソートされる', () => {
      const results = calculateAndSortMatches(mockStores, DEFAULT_USER_PREFERENCES)

      // 完全一致店舗が最初に来る
      expect(results[0].store.id).toBe('perfect')
      expect(results[0].matchScore).toBe(100)

      // 後続のスコアは降順
      for (let i = 1; i < results.length; i++) {
        expect(results[i].matchScore).toBeLessThanOrEqual(results[i - 1].matchScore)
      }
    })

    it('好み変更でマッチング順位が変わる', () => {
      // 大きいサイズを好む設定
      const bigSizePreference = {
        skinStyle: 5,
        fillingStyle: 5,
        overallTaste: 5,
        size: 9 // 大きいサイズを好む
      }

      const results = calculateAndSortMatches(mockStores, bigSizePreference)

      // 四興樓（size: 9）が最もマッチする
      expect(results[0].store.id).toBe('shikohroh')
    })
  })

  describe('フィルターモーダルのユーザーフロー', () => {
    it('スライダー操作で結果がリアルタイム更新される', async () => {
      const onStoreSelect = jest.fn()

      render(
        <FilterMatchingModal
          isOpen={true}
          onClose={jest.fn()}
          stores={mockStores}
          onStoreSelect={onStoreSelect}
        />
      )

      // 初期状態で完全一致店舗が100%表示
      expect(screen.getByText('100%')).toBeInTheDocument()

      // スライダーを変更
      const sliders = screen.getAllByRole('slider')
      fireEvent.change(sliders[3], { target: { value: '9' } }) // size を 9 に

      // 結果が更新される（四興樓がトップに来る可能性）
      await waitFor(() => {
        const storeButtons = screen.getAllByRole('button').filter(
          btn => btn.textContent?.includes('四興樓')
        )
        expect(storeButtons.length).toBeGreaterThan(0)
      })
    })

    it('店舗選択でコールバックが呼ばれる', () => {
      const onStoreSelect = jest.fn()

      render(
        <FilterMatchingModal
          isOpen={true}
          onClose={jest.fn()}
          stores={mockStores}
          onStoreSelect={onStoreSelect}
        />
      )

      // 店舗カードをクリック
      const storeCard = screen.getByText('老祥記').closest('button')
      if (storeCard) {
        fireEvent.click(storeCard)
      }

      expect(onStoreSelect).toHaveBeenCalled()
      const selectedStore = onStoreSelect.mock.calls[0][0]
      expect(selectedStore.id).toBe('roushouki')
    })

    it('リセットで全スライダーが中央値に戻る', async () => {
      render(
        <FilterMatchingModal
          isOpen={true}
          onClose={jest.fn()}
          stores={mockStores}
          onStoreSelect={jest.fn()}
        />
      )

      // スライダーを変更
      const sliders = screen.getAllByRole('slider')
      fireEvent.change(sliders[0], { target: { value: '8' } })
      expect(sliders[0]).toHaveValue('8')

      // リセット
      fireEvent.click(screen.getByText('リセット'))

      // すべてのスライダーが5に戻る
      await waitFor(() => {
        sliders.forEach(slider => {
          expect(slider).toHaveValue('5')
        })
      })
    })
  })

  describe('パフォーマンス検証', () => {
    it('多数の店舗でも高速にマッチング計算できる', () => {
      // 100店舗のモックデータを生成
      const manyStores = Array.from({ length: 100 }, (_, i) =>
        createMockStore(`store-${i}`, `店舗${i}`, {
          skinStyle: (i % 10) + 1,
          fillingStyle: (i % 10) + 1,
          overallTaste: (i % 10) + 1,
          size: (i % 10) + 1
        })
      )

      const start = performance.now()
      const results = calculateAndSortMatches(manyStores, DEFAULT_USER_PREFERENCES)
      const end = performance.now()

      // 100ms以内で計算完了
      expect(end - start).toBeLessThan(100)
      expect(results).toHaveLength(100)
    })
  })
})
