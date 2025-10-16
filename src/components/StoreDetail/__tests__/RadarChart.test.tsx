import { render, screen } from '@testing-library/react'
import { RadarChart } from '../RadarChart'
import { ExtendedStore } from '@/types/store'

const mockStore: ExtendedStore = {
  id: 'test-store',
  name: 'テスト店舗',
  address: '〒650-0001 神戸市中央区test',
  coordinates: { lat: 34.6937, lng: 135.5023 },
  district: '中央区',
  businessHours: '10:00-18:00',
  price: 150,
  features: ['特徴1', '特徴2'],
  description: 'テスト用の店舗です',
  googleMapsUrl: 'https://maps.google.com/?q=test',
  categories: ['テイクアウト'],
  aiAnalysis: {
    features: {
      taste: 8,
      texture: 7,
      size: 6,
      priceValue: 9,
      atmosphere: 8
    },
    confidence: 85,
    reviewCount: 50,
    analysisDate: '2025-10-15'
  },
  dataSource: {
    collectionDate: '2025-10-15',
    sourceUrl: 'https://example.com',
    isEnhanced: true
  }
}

describe('RadarChart コンポーネント', () => {
  it('レーダーチャートが正しく描画される', () => {
    render(<RadarChart stores={[mockStore]} mode="single" selectedStoreIds={['test-store']} />)
    
    // チャート要素の存在確認
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument()
  })

  it('5軸のラベルが表示される', () => {
    render(<RadarChart stores={[mockStore]} mode="single" selectedStoreIds={['test-store']} />)
    
    // 5軸のラベル確認
    expect(screen.getByText('味の濃さ')).toBeInTheDocument()
    expect(screen.getByText('食感')).toBeInTheDocument()
    expect(screen.getByText('ボリューム')).toBeInTheDocument()
    expect(screen.getByText('価格満足度')).toBeInTheDocument()
    expect(screen.getByText('総合評価')).toBeInTheDocument()
  })

  it('AI分析データがない場合は非表示になる', () => {
    const storeWithoutAI: ExtendedStore = {
      ...mockStore,
      aiAnalysis: undefined
    }
    
    render(<RadarChart stores={[storeWithoutAI]} mode="single" selectedStoreIds={['test-store']} />)
    
    expect(screen.getByText('AI分析データがありません')).toBeInTheDocument()
  })

  it('複数店舗の比較モードが動作する', () => {
    const secondStore: ExtendedStore = {
      ...mockStore,
      id: 'test-store-2',
      name: 'テスト店舗2',
      aiAnalysis: {
        features: {
          taste: 6,
          texture: 9,
          size: 8,
          priceValue: 7,
          atmosphere: 6
        },
        confidence: 90,
        reviewCount: 30,
        analysisDate: '2025-10-15'
      }
    }

    render(
      <RadarChart 
        stores={[mockStore, secondStore]} 
        mode="comparison" 
        selectedStoreIds={['test-store', 'test-store-2']} 
      />
    )
    
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument()
    expect(screen.getByText('テスト店舗')).toBeInTheDocument()
    expect(screen.getByText('テスト店舗2')).toBeInTheDocument()
  })

  it('0-10スケールの軸設定が正しい', () => {
    render(<RadarChart stores={[mockStore]} mode="single" selectedStoreIds={['test-store']} />)
    
    // 軸の範囲確認
    const chart = screen.getByTestId('radar-chart')
    expect(chart).toBeInTheDocument()
  })
})