import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import StoreMarker from '@/components/StoreMarker'
import { ExtendedStore } from '@/types/store'

// AdvancedMarkerElementインスタンスのモック
const mockMarkerInstance = {
  addListener: jest.fn(),
  map: null as unknown,
  position: null as unknown,
}

// Google Maps APIのモック（AdvancedMarkerElement対応）
const mockGoogleMaps = {
  importLibrary: jest.fn(),
  marker: {
    AdvancedMarkerElement: jest.fn(() => mockMarkerInstance),
  },
  event: {
    removeListener: jest.fn(),
  },
}

// グローバルgoogleオブジェクトのモック
Object.defineProperty(window, 'google', {
  value: {
    maps: mockGoogleMaps
  },
  writable: true
})

// テスト用の店舗データ
const mockStore: ExtendedStore = {
  id: 'roushouki',
  name: '老祥記',
  address: '〒650-0022 兵庫県神戸市中央区元町通2-1-14',
  coordinates: {
    lat: 34.6918,
    lng: 135.1955
  },
  district: '中央区',
  businessHours: '月〜土 8:30-18:30 (定休日: 日曜)',
  features: ['伝統の味', '行列必至', '豚饅発祥', '老舗'],
  description: '豚饅の元祖として知られる老舗',
  googleMapsUrl: 'https://maps.google.com/?q=老祥記',
  categories: ['テイクアウト'],
  dataSource: {
    collectionDate: '2026-01-13',
    sourceUrl: 'https://example.com',
    isEnhanced: false
  }
}

const mockMap = {
  setCenter: jest.fn(),
  setZoom: jest.fn(),
}

describe('StoreMarker', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGoogleMaps.importLibrary.mockResolvedValue({})
    mockMarkerInstance.addListener.mockReturnValue({ remove: jest.fn() })
    mockMarkerInstance.map = null
    mockMarkerInstance.position = null
  })

  test('店舗データからマーカーが正しく作成されること', async () => {
    render(<StoreMarker store={mockStore} map={mockMap} />)

    await waitFor(() => {
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalledWith(
        expect.objectContaining({
          position: mockStore.coordinates,
          map: mockMap,
          title: mockStore.name,
        })
      )
    })
  })

  test('markerライブラリが動的インポートされること', async () => {
    render(<StoreMarker store={mockStore} map={mockMap} />)

    await waitFor(() => {
      expect(mockGoogleMaps.importLibrary).toHaveBeenCalledWith('marker')
    })
  })

  test('マーカーにクリックイベントリスナーが追加されること', async () => {
    render(<StoreMarker store={mockStore} map={mockMap} />)

    await waitFor(() => {
      expect(mockMarkerInstance.addListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      )
    })
  })

  test('マーカークリック時にonMarkerClick関数が呼ばれること', async () => {
    const mockOnMarkerClick = jest.fn()

    render(
      <StoreMarker
        store={mockStore}
        map={mockMap}
        onMarkerClick={mockOnMarkerClick}
      />
    )

    await waitFor(() => {
      expect(mockMarkerInstance.addListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      )
    })

    // マーカーのクリックイベントを模擬実行
    const clickHandler = mockMarkerInstance.addListener.mock.calls.find(
      call => call[0] === 'click'
    )?.[1]

    if (clickHandler) {
      clickHandler()
    }

    expect(mockOnMarkerClick).toHaveBeenCalledWith(mockStore)
  })

  test('カスタムアイコンがコンテンツとして設定されること', async () => {
    render(<StoreMarker store={mockStore} map={mockMap} />)

    await waitFor(() => {
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalled()
    })

    const markerCall = (mockGoogleMaps.marker.AdvancedMarkerElement as jest.Mock).mock.calls[0]?.[0]
    expect(markerCall).toBeDefined()
    const content = markerCall.content as HTMLImageElement
    expect(content).toBeInstanceOf(HTMLImageElement)
    expect(content.src).toContain('/icons/ban-logo.svg')
    expect(content.style.width).toBe('40px')
    expect(content.style.height).toBe('40px')
  })

  test('マーカーが正しい位置に配置されること', async () => {
    render(<StoreMarker store={mockStore} map={mockMap} />)

    await waitFor(() => {
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalled()
    })

    const markerCall = (mockGoogleMaps.marker.AdvancedMarkerElement as jest.Mock).mock.calls[0]?.[0]
    expect(markerCall.position).toEqual(mockStore.coordinates)
  })

  test('店舗名がマーカーのタイトルに設定されること', async () => {
    render(<StoreMarker store={mockStore} map={mockMap} />)

    await waitFor(() => {
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalled()
    })

    const markerCall = (mockGoogleMaps.marker.AdvancedMarkerElement as jest.Mock).mock.calls[0]?.[0]
    expect(markerCall.title).toBe(mockStore.name)
  })

  test('mapプロパティが変更された時にマーカーが再作成されること', async () => {
    const newMap = { setCenter: jest.fn(), setZoom: jest.fn() }
    const { rerender } = render(<StoreMarker store={mockStore} map={mockMap} />)

    await waitFor(() => {
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalled()
    })

    rerender(<StoreMarker store={mockStore} map={newMap} />)

    await waitFor(() => {
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenLastCalledWith(
        expect.objectContaining({ map: newMap })
      )
    })
  })

  test('店舗データが変更された時にマーカーが更新されること', async () => {
    const updatedStore = {
      ...mockStore,
      coordinates: { lat: 34.7, lng: 135.2 }
    }
    const { rerender } = render(<StoreMarker store={mockStore} map={mockMap} />)

    await waitFor(() => {
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalled()
    })

    rerender(<StoreMarker store={updatedStore} map={mockMap} />)

    await waitFor(() => {
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenLastCalledWith(
        expect.objectContaining({ position: updatedStore.coordinates })
      )
    })
  })

  test('コンポーネントアンマウント時にマーカーがクリーンアップされること', async () => {
    const { unmount } = render(<StoreMarker store={mockStore} map={mockMap} />)

    await waitFor(() => {
      expect(mockGoogleMaps.marker.AdvancedMarkerElement).toHaveBeenCalled()
    })

    unmount()

    // イベントリスナーが削除され、マーカーが地図から外れること
    expect(mockGoogleMaps.event.removeListener).toHaveBeenCalled()
    expect(mockMarkerInstance.map).toBeNull()
  })

  test('onMarkerClickが未提供でもエラーが発生しないこと', () => {
    expect(() => {
      render(<StoreMarker store={mockStore} map={mockMap} />)
    }).not.toThrow()
  })
})
