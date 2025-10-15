import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MapWithStores from '@/components/MapWithStores'
import * as storeDataModule from '@/lib/store-data'

// Google Maps APIのモック
const mockMarker = {
  setPosition: jest.fn(),
  setVisible: jest.fn(),
  addListener: jest.fn(),
  setMap: jest.fn(),
}

const mockMap = {
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  addListener: jest.fn(),
}

const mockGoogleMaps = {
  Map: jest.fn(() => mockMap),
  Marker: jest.fn(() => mockMarker),
  LatLng: jest.fn((lat, lng) => ({ lat, lng })),
  Size: jest.fn((width, height) => ({ width, height })),
  Point: jest.fn((x, y) => ({ x, y })),
  MapTypeId: {
    ROADMAP: 'roadmap'
  }
}

Object.defineProperty(window, 'google', {
  value: {
    maps: mockGoogleMaps
  },
  writable: true
})

// テスト用の店舗データ
const mockStores = [
  {
    id: 'roushouki',
    name: '老祥記',
    address: '〒650-0022 兵庫県神戸市中央区元町通2-1-14',
    coordinates: { lat: 34.6918, lng: 135.1955 },
    district: '中央区',
    businessHours: '月〜土 8:30-18:30',
    price: 100,
    features: ['伝統の味'],
    images: ['/test.jpg'],
    googleMapsUrl: 'https://maps.google.com',
    categories: ['テイクアウト']
  },
  {
    id: 'shikohroh',
    name: '四興樓',
    address: '〒650-0022 兵庫県神戸市中央区元町通2-9-1',
    coordinates: { lat: 34.6920, lng: 135.1958 },
    district: '中央区',
    businessHours: '11:00-20:00',
    price: 120,
    features: ['バリエーション豊富'],
    images: ['/test2.jpg'],
    googleMapsUrl: 'https://maps.google.com',
    categories: ['テイクアウト']
  }
]

// store-dataモジュールのモック
jest.mock('@/lib/store-data', () => ({
  getStoresData: jest.fn()
}))

const mockGetStoresData = storeDataModule.getStoresData as jest.MockedFunction<typeof storeDataModule.getStoresData>

describe('MapWithStores Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetStoresData.mockResolvedValue(mockStores)
  })

  test('店舗データが読み込まれてマーカーが作成されること', async () => {
    render(<MapWithStores />)
    
    await waitFor(() => {
      expect(mockGetStoresData).toHaveBeenCalled()
    })
    
    await waitFor(() => {
      // 各店舗に対してマーカーが作成されることを確認
      expect(mockGoogleMaps.Marker).toHaveBeenCalledTimes(mockStores.length)
    })
  })

  test('各店舗マーカーが正しい位置に配置されること', async () => {
    render(<MapWithStores />)
    
    await waitFor(() => {
      expect(mockGoogleMaps.Marker).toHaveBeenCalledTimes(2)
    })

    // 第1店舗（老祥記）のマーカー
    expect(mockGoogleMaps.Marker).toHaveBeenNthCalledWith(1, expect.objectContaining({
      position: mockStores[0].coordinates,
      title: mockStores[0].name
    }))

    // 第2店舗（四興樓）のマーカー
    expect(mockGoogleMaps.Marker).toHaveBeenNthCalledWith(2, expect.objectContaining({
      position: mockStores[1].coordinates,
      title: mockStores[1].name
    }))
  })

  test('店舗データ読み込みエラー時に適切に処理されること', async () => {
    mockGetStoresData.mockRejectedValue(new Error('データ読み込み失敗'))
    
    render(<MapWithStores />)
    
    await waitFor(() => {
      expect(mockGetStoresData).toHaveBeenCalled()
    })

    // エラー時でもマップコンポーネントは表示される
    const mapElement = screen.getByTestId('map-container')
    expect(mapElement).toBeInTheDocument()
  })

  test('地図とマーカーが同時に初期化されること', async () => {
    render(<MapWithStores />)
    
    await waitFor(() => {
      expect(mockGoogleMaps.Map).toHaveBeenCalled()
      expect(mockGoogleMaps.Marker).toHaveBeenCalledTimes(2)
    })

    // マーカーが正しいマップインスタンスに追加されることを確認
    mockGoogleMaps.Marker.mock.calls.forEach(call => {
      expect(call[0].map).toBe(mockMap)
    })
  })

  test('マーカークリック時に店舗詳細モーダルが表示される予定', async () => {
    render(<MapWithStores />)
    
    await waitFor(() => {
      expect(mockMarker.addListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      )
    })
    
    // 将来実装予定：クリックイベントハンドラの動作確認
    // ここではイベントリスナーが正しく追加されていることのみ確認
    expect(mockMarker.addListener).toHaveBeenCalledTimes(2) // 2つの店舗
  })
})