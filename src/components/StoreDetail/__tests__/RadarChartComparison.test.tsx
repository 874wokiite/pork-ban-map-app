import { render, screen, fireEvent } from '@testing-library/react'
import { RadarChartComparison } from '../RadarChartComparison'
import { ExtendedStore } from '@/types/store'

const mockStores: ExtendedStore[] = [
  {
    id: 'store-1',
    name: '老祥記',
    address: '〒650-0001 神戸市中央区test1',
    coordinates: { lat: 34.6937, lng: 135.5023 },
    district: '中央区',
    businessHours: '10:00-18:00',
    price: 120,
    features: ['伝統の醤油味'],
    googleMapsUrl: 'https://maps.google.com/?q=test1',
    categories: ['テイクアウト'],
    aiAnalysis: {
      features: { taste: 8, texture: 9, size: 4, priceValue: 9, atmosphere: 8 },
      confidence: 92,
      reviewCount: 150,
      analysisDate: '2025-10-15'
    },
    dataSource: { collectionDate: '2025-10-15', sourceUrl: 'https://example.com', isEnhanced: true }
  },
  {
    id: 'store-2',
    name: '四興樓',
    address: '〒650-0002 神戸市中央区test2',
    coordinates: { lat: 34.6940, lng: 135.5020 },
    district: '中央区',
    businessHours: '11:00-20:00',
    price: 211,
    features: ['大ぶりサイズ'],
    googleMapsUrl: 'https://maps.google.com/?q=test2',
    categories: ['テイクアウト'],
    aiAnalysis: {
      features: { taste: 7, texture: 8, size: 9, priceValue: 6, atmosphere: 7 },
      confidence: 85,
      reviewCount: 89,
      analysisDate: '2025-10-15'
    },
    dataSource: { collectionDate: '2025-10-15', sourceUrl: 'https://example.com', isEnhanced: true }
  },
  {
    id: 'store-3',
    name: '三宮一貫楼',
    address: '〒650-0003 神戸市中央区test3',
    coordinates: { lat: 34.6943, lng: 135.5017 },
    district: '中央区',
    businessHours: '11:30-20:30',
    price: 200,
    features: ['玉ねぎの甘み'],
    googleMapsUrl: 'https://maps.google.com/?q=test3',
    categories: ['テイクアウト'],
    aiAnalysis: {
      features: { taste: 6, texture: 7, size: 7, priceValue: 6, atmosphere: 7 },
      confidence: 78,
      reviewCount: 65,
      analysisDate: '2025-10-15'
    },
    dataSource: { collectionDate: '2025-10-15', sourceUrl: 'https://example.com', isEnhanced: true }
  }
]

describe('RadarChartComparison コンポーネント', () => {
  it('店舗選択UIが表示される', () => {
    render(<RadarChartComparison stores={mockStores} />)
    
    expect(screen.getByText('店舗比較')).toBeInTheDocument()
    expect(screen.getByText('老祥記')).toBeInTheDocument()
    expect(screen.getByText('四興樓')).toBeInTheDocument()
    expect(screen.getByText('三宮一貫楼')).toBeInTheDocument()
  })

  it('単一表示モードと比較モードを切り替えできる', () => {
    render(<RadarChartComparison stores={mockStores} />)
    
    const singleModeButton = screen.getByText('単一表示')
    const comparisonModeButton = screen.getByText('比較表示')
    
    expect(singleModeButton).toBeInTheDocument()
    expect(comparisonModeButton).toBeInTheDocument()
    
    fireEvent.click(comparisonModeButton)
    expect(comparisonModeButton).toHaveClass('bg-blue-500')
  })

  it('店舗を選択できる', () => {
    render(<RadarChartComparison stores={mockStores} />)
    
    const storeLabel = screen.getByText('老祥記').closest('label')
    const storeCheckbox = storeLabel?.querySelector('input')
    
    expect(storeCheckbox).toBeTruthy()
    fireEvent.click(storeCheckbox!)
    
    expect(storeCheckbox).toBeChecked()
  })

  it('最大3店舗まで選択できる', () => {
    render(<RadarChartComparison stores={mockStores} />)
    
    // 比較モードに切り替え
    fireEvent.click(screen.getByText('比較表示'))
    
    // 3店舗全て選択
    const store1Input = screen.getByText('老祥記').closest('label')?.querySelector('input')
    const store2Input = screen.getByText('四興樓').closest('label')?.querySelector('input')
    const store3Input = screen.getByText('三宮一貫楼').closest('label')?.querySelector('input')
    
    fireEvent.click(store1Input!)
    fireEvent.click(store2Input!)
    fireEvent.click(store3Input!)
    
    expect(store1Input).toBeChecked()
    expect(store2Input).toBeChecked()
    expect(store3Input).toBeChecked()
  })

  it('選択した店舗のレーダーチャートが表示される', () => {
    render(<RadarChartComparison stores={mockStores} />)
    
    // 店舗を選択
    const storeInput = screen.getByText('老祥記').closest('label')?.querySelector('input')
    fireEvent.click(storeInput!)
    
    // レーダーチャートが表示されることを確認
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument()
  })

  it('店舗が選択されていない場合は選択を促すメッセージが表示される', () => {
    render(<RadarChartComparison stores={mockStores} />)
    
    expect(screen.getByText('比較したい店舗を選択してください')).toBeInTheDocument()
  })
})