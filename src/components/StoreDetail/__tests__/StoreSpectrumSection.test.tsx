import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import StoreSpectrumSection from '../StoreSpectrumSection'
import { ExtendedStore } from '@/types/store'

const createMockStore = (
  features?: { skinStyle: number; fillingStyle: number; overallTaste: number; size: number }
): ExtendedStore => ({
  id: 'test',
  name: 'テスト店舗',
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

describe('StoreSpectrumSection', () => {
  describe('aiAnalysisがある場合', () => {
    it('スペクトラムバーセクションが表示される', () => {
      const store = createMockStore({
        skinStyle: 8,
        fillingStyle: 5,
        overallTaste: 6,
        size: 3
      })

      render(<StoreSpectrumSection store={store} />)

      expect(screen.getByTestId('spectrum-section')).toBeInTheDocument()
    })

    it('4つの評価軸ラベルが表示される', () => {
      const store = createMockStore({
        skinStyle: 8,
        fillingStyle: 5,
        overallTaste: 6,
        size: 3
      })

      render(<StoreSpectrumSection store={store} />)

      expect(screen.getByText('薄皮ふわふわ')).toBeInTheDocument()
      expect(screen.getByText('厚皮もちもち')).toBeInTheDocument()
      expect(screen.getByText('あっさり')).toBeInTheDocument()
      expect(screen.getByText('こってり')).toBeInTheDocument()
      expect(screen.getByText('優しい味')).toBeInTheDocument()
      expect(screen.getByText('パンチ')).toBeInTheDocument()
      expect(screen.getByText('小ぶり')).toBeInTheDocument()
      expect(screen.getByText('大ぶり')).toBeInTheDocument()
    })

    it('セクションタイトルが表示される', () => {
      const store = createMockStore({
        skinStyle: 8,
        fillingStyle: 5,
        overallTaste: 6,
        size: 3
      })

      render(<StoreSpectrumSection store={store} />)

      expect(screen.getByText('豚饅の特徴')).toBeInTheDocument()
    })
  })

  describe('aiAnalysisがない場合', () => {
    it('何も表示されない', () => {
      const store = createMockStore() // aiAnalysisなし

      const { container } = render(<StoreSpectrumSection store={store} />)

      expect(container).toBeEmptyDOMElement()
    })
  })
})
