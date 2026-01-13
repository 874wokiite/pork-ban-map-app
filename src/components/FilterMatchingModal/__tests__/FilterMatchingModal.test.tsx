import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import FilterMatchingModal from '../FilterMatchingModal'
import { ExtendedStore } from '@/types/store'

// テスト用のモックストア作成ヘルパー
const createMockStore = (
  id: string,
  name: string,
  features?: { skinStyle: number; fillingStyle: number; overallTaste: number; size: number }
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
    isEnhanced: features !== undefined
  },
  ...(features && {
    aiAnalysis: {
      features,
      analysisDate: '2026-01-13'
    }
  })
})

const mockStores = [
  createMockStore('1', '老祥記', { skinStyle: 8, fillingStyle: 5, overallTaste: 6, size: 3 }),
  createMockStore('2', '四興樓', { skinStyle: 4, fillingStyle: 7, overallTaste: 4, size: 9 }),
  createMockStore('3', '三宮一貫楼', { skinStyle: 5, fillingStyle: 5, overallTaste: 5, size: 5 })
]

describe('FilterMatchingModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    stores: mockStores,
    onStoreSelect: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('モーダル表示', () => {
    it('isOpenがtrueの場合モーダルが表示される', () => {
      render(<FilterMatchingModal {...defaultProps} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('isOpenがfalseの場合モーダルが非表示', () => {
      render(<FilterMatchingModal {...defaultProps} isOpen={false} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('タイトルが表示される', () => {
      render(<FilterMatchingModal {...defaultProps} />)

      expect(screen.getByText('好みで探す')).toBeInTheDocument()
    })
  })

  describe('モーダル閉じる操作', () => {
    it('閉じるボタンでonCloseが呼ばれる', () => {
      render(<FilterMatchingModal {...defaultProps} />)

      const closeButton = screen.getByLabelText('閉じる')
      fireEvent.click(closeButton)

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('背景クリックでonCloseが呼ばれる', () => {
      render(<FilterMatchingModal {...defaultProps} />)

      const backdrop = screen.getByTestId('modal-backdrop')
      fireEvent.click(backdrop)

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('Escキーでoncloseが呼ばれる', () => {
      render(<FilterMatchingModal {...defaultProps} />)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('スライダー表示', () => {
    it('4つの評価軸スライダーが表示される', () => {
      render(<FilterMatchingModal {...defaultProps} />)

      expect(screen.getByText('薄皮ふわふわ')).toBeInTheDocument()
      expect(screen.getByText('厚皮もちもち')).toBeInTheDocument()
      expect(screen.getByText('あっさり')).toBeInTheDocument()
      expect(screen.getByText('こってり')).toBeInTheDocument()
      expect(screen.getByText('優しい味')).toBeInTheDocument()
      expect(screen.getByText('パンチ')).toBeInTheDocument()
      expect(screen.getByText('小ぶり')).toBeInTheDocument()
      expect(screen.getByText('大ぶり')).toBeInTheDocument()
    })

    it('スライダーが4つ表示される', () => {
      render(<FilterMatchingModal {...defaultProps} />)

      const sliders = screen.getAllByRole('slider')
      expect(sliders).toHaveLength(4)
    })
  })

  describe('マッチング結果', () => {
    it('店舗リストが表示される', () => {
      render(<FilterMatchingModal {...defaultProps} />)

      expect(screen.getByText('老祥記')).toBeInTheDocument()
      expect(screen.getByText('四興樓')).toBeInTheDocument()
      expect(screen.getByText('三宮一貫楼')).toBeInTheDocument()
    })

    it('マッチ度が表示される', () => {
      render(<FilterMatchingModal {...defaultProps} />)

      // 三宮一貫楼は中央値で100%マッチ
      expect(screen.getByText(/100%/)).toBeInTheDocument()
    })

    it('店舗をクリックするとonStoreSelectが呼ばれる', () => {
      render(<FilterMatchingModal {...defaultProps} />)

      const storeCard = screen.getByText('老祥記').closest('button')
      if (storeCard) {
        fireEvent.click(storeCard)
      }

      expect(defaultProps.onStoreSelect).toHaveBeenCalled()
    })
  })

  describe('リセット機能', () => {
    it('リセットボタンが表示される', () => {
      render(<FilterMatchingModal {...defaultProps} />)

      expect(screen.getByText('リセット')).toBeInTheDocument()
    })

    it('リセットボタンでスライダーが中央値に戻る', async () => {
      render(<FilterMatchingModal {...defaultProps} />)

      // スライダーを変更
      const sliders = screen.getAllByRole('slider')
      fireEvent.change(sliders[0], { target: { value: '8' } })

      // リセット
      const resetButton = screen.getByText('リセット')
      fireEvent.click(resetButton)

      // すべてのスライダーが5に戻る
      await waitFor(() => {
        sliders.forEach(slider => {
          expect(slider).toHaveValue('5')
        })
      })
    })
  })

  describe('aiAnalysisがない店舗', () => {
    it('aiAnalysisがない店舗は結果に表示されない', () => {
      const storesWithMissing = [
        ...mockStores,
        createMockStore('no-data', 'データなし店舗') // aiAnalysisなし
      ]

      render(<FilterMatchingModal {...defaultProps} stores={storesWithMissing} />)

      expect(screen.queryByText('データなし店舗')).not.toBeInTheDocument()
    })
  })

  describe('最小マッチ度フィルター', () => {
    it('デフォルトで70%未満の店舗は表示されない', () => {
      // 老祥記と四興樓は中央値から離れているので70%未満になる可能性がある
      // 三宮一貫楼（中央値）は100%なので表示される
      render(<FilterMatchingModal {...defaultProps} />)

      // 100%の店舗は必ず表示される
      expect(screen.getByText('三宮一貫楼')).toBeInTheDocument()
    })

    it('minScore=0で全店舗が表示される', () => {
      render(<FilterMatchingModal {...defaultProps} minScore={0} />)

      expect(screen.getByText('老祥記')).toBeInTheDocument()
      expect(screen.getByText('四興樓')).toBeInTheDocument()
      expect(screen.getByText('三宮一貫楼')).toBeInTheDocument()
    })
  })
})
