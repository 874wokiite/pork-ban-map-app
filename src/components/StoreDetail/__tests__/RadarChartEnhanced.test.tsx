import { render, screen } from '@testing-library/react'
import { RadarChartEnhanced } from '../RadarChartEnhanced'
import { ExtendedStore } from '@/types/store'

const mockStore: ExtendedStore = {
  id: 'test-store',
  name: 'テスト店舗',
  address: '〒650-0001 神戸市中央区test',
  coordinates: { lat: 34.6937, lng: 135.5023 },
  district: '中央区',
  businessHours: '10:00-18:00',
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

describe('RadarChartEnhanced コンポーネント', () => {
  it('レスポンシブデザインが適用される', () => {
    render(<RadarChartEnhanced stores={[mockStore]} selectedStoreIds={['test-store']} />)
    
    const container = screen.getByTestId('enhanced-radar-chart')
    expect(container).toHaveClass('w-full')
  })

  it('アクセシビリティ対応が含まれる', () => {
    render(<RadarChartEnhanced stores={[mockStore]} selectedStoreIds={['test-store']} />)
    
    const chart = screen.getByTestId('enhanced-radar-chart')
    expect(chart).toHaveAttribute('role', 'img')
    expect(chart).toHaveAttribute('aria-label')
  })

  it('ローディング状態が表示される', () => {
    render(<RadarChartEnhanced stores={[mockStore]} selectedStoreIds={['test-store']} isLoading={true} />)
    
    expect(screen.getByText('チャートを読み込み中...')).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('エラー状態が表示される', () => {
    const mockRetry = jest.fn()
    render(<RadarChartEnhanced stores={[]} selectedStoreIds={[]} error="データの読み込みに失敗しました" onRetry={mockRetry} />)
    
    expect(screen.getByText('データの読み込みに失敗しました')).toBeInTheDocument()
    expect(screen.getByText('再試行')).toBeInTheDocument()
  })

  it('詳細情報のツールチップが表示される', () => {
    render(<RadarChartEnhanced stores={[mockStore]} selectedStoreIds={['test-store']} showTooltip={true} />)
    
    const chart = screen.getByTestId('enhanced-radar-chart')
    expect(chart).toBeInTheDocument()
  })

  it('グラフのアニメーション設定が適用される', () => {
    render(<RadarChartEnhanced stores={[mockStore]} selectedStoreIds={['test-store']} animationEnabled={true} />)
    
    const chart = screen.getByTestId('enhanced-radar-chart')
    expect(chart).toBeInTheDocument()
  })
})