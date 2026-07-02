import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MapWithStores from '@/components/MapWithStores'
import * as storeDataModule from '@/lib/store-data'
import { ExtendedStore } from '@/types/store'

// AdvancedMarkerElementインスタンスのモック
const mockMarkerInstance = {
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  map: null as unknown,
  position: null as unknown,
}

const mockMap = {
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  addListener: jest.fn(),
}

// Google Maps APIのモック（AdvancedMarkerElement対応）
const mockGoogleMaps = {
  Map: jest.fn(() => mockMap),
  importLibrary: jest.fn(),
  marker: {
    AdvancedMarkerElement: jest.fn(() => mockMarkerInstance),
  },
  event: {
    removeListener: jest.fn(),
  },
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
const mockStores: ExtendedStore[] = [
  {
    id: 'roushouki',
    name: '老祥記',
    address: '〒650-0022 兵庫県神戸市中央区元町通2-1-14',
    coordinates: { lat: 34.6918, lng: 135.1955 },
    district: '中央区',
    businessHours: '月〜土 8:30-18:30',
    features: ['伝統の味'],
    googleMapsUrl: 'https://maps.google.com',
    categories: ['テイクアウト'],
    dataSource: {
      collectionDate: '2026-01-13',
      sourceUrl: 'https://example.com',
      isEnhanced: false
    }
  },
  {
    id: 'shikohroh',
    name: '四興樓',
    address: '〒650-0022 兵庫県神戸市中央区元町通2-9-1',
    coordinates: { lat: 34.6920, lng: 135.1958 },
    district: '中央区',
    businessHours: '11:00-20:00',
    features: ['バリエーション豊富'],
    googleMapsUrl: 'https://maps.google.com',
    categories: ['テイクアウト'],
    dataSource: {
      collectionDate: '2026-01-13',
      sourceUrl: 'https://example.com',
      isEnhanced: false
    }
  }
]

// store-dataモジュールのモック
jest.mock('@/lib/store-data', () => ({
  getExtendedStoresData: jest.fn()
}))

const mockGetExtendedStoresData = storeDataModule.getExtendedStoresData as jest.MockedFunction<typeof storeDataModule.getExtendedStoresData>

describe('MapWithStores Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetExtendedStoresData.mockResolvedValue(mockStores)
    mockGoogleMaps.importLibrary.mockResolvedValue({})
    mockMarkerInstance.addListener.mockReturnValue({ remove: jest.fn() })
  })

  test('店舗データが読み込まれてマーカーが作成されること', async () => {
    render(<MapWithStores />)

    await waitFor(() => {
      expect(mockGetExtendedStoresData).toHaveBeenCalled()
    })

    await waitFor(() => {
      // 各店舗に対してマーカーが作成されることを確認
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalledTimes(mockStores.length)
    })
  })

  test('各店舗マーカーが正しい位置に配置されること', async () => {
    render(<MapWithStores />)

    await waitFor(() => {
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalledTimes(2)
    })

    // 第1店舗（老祥記）のマーカー
    expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenNthCalledWith(1, expect.objectContaining({
      position: mockStores[0].coordinates,
      title: mockStores[0].name
    }))

    // 第2店舗（四興樓）のマーカー
    expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenNthCalledWith(2, expect.objectContaining({
      position: mockStores[1].coordinates,
      title: mockStores[1].name
    }))
  })

  test('店舗データ読み込みエラー時に適切に処理されること', async () => {
    mockGetExtendedStoresData.mockRejectedValue(new Error('データ読み込み失敗'))

    render(<MapWithStores />)

    await waitFor(() => {
      expect(mockGetExtendedStoresData).toHaveBeenCalled()
    })

    // エラー時でもマップコンポーネントは表示される
    const mapElement = screen.getByTestId('map-container')
    expect(mapElement).toBeInTheDocument()
  })

  test('地図とマーカーが同時に初期化されること', async () => {
    render(<MapWithStores />)

    await waitFor(() => {
      expect(mockGoogleMaps.Map).toHaveBeenCalled()
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalledTimes(2)
    })

    // マーカーが正しいマップインスタンスに追加されることを確認
    const markerCalls = (mockGoogleMaps.marker.AdvancedMarkerElement as jest.Mock).mock.calls
    markerCalls.forEach((call) => {
      const options = call[0] as { map?: unknown } | undefined
      if (options && 'map' in options) {
        expect(options.map).toBe(mockMap)
      }
    })
  })

  test('マーカークリック時に店舗詳細モーダルが表示される予定', async () => {
    render(<MapWithStores />)

    await waitFor(() => {
      expect(mockMarkerInstance.addListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      )
    })

    // 将来実装予定：クリックイベントハンドラの動作確認
    // ここではイベントリスナーが正しく追加されていることのみ確認
    await waitFor(() => {
      expect(mockMarkerInstance.addListener).toHaveBeenCalledTimes(2) // 2つの店舗
    })
  })
})
