import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import StoreMarker from '@/components/StoreMarker'
import { Store } from '@/types/store'

// Google Maps APIのモック
const mockMarker = {
  setPosition: jest.fn(),
  setVisible: jest.fn(),
  addListener: jest.fn(),
  setMap: jest.fn(),
}

const mockGoogleMaps = {
  Marker: jest.fn(() => mockMarker),
  LatLng: jest.fn((lat, lng) => ({ lat, lng })),
  Size: jest.fn((width, height) => ({ width, height })),
  Point: jest.fn((x, y) => ({ x, y })),
  event: {
    addListener: jest.fn(),
    clearInstanceListeners: jest.fn(),
  }
}

// グローバルgoogleオブジェクトのモック
Object.defineProperty(window, 'google', {
  value: {
    maps: mockGoogleMaps
  },
  writable: true
})

// テスト用の店舗データ
const mockStore: Store = {
  id: 'roushouki',
  name: '老祥記',
  address: '〒650-0022 兵庫県神戸市中央区元町通2-1-14',
  coordinates: {
    lat: 34.6918,
    lng: 135.1955
  },
  district: '中央区',
  businessHours: '月〜土 8:30-18:30 (定休日: 日曜)',
  price: 100,
  features: ['伝統の味', '行列必至', '豚饅発祥', '老舗'],
  description: '豚饅の元祖として知られる老舗',
  images: ['/images/stores/roushouki/exterior.jpg'],
  phone: '078-331-7714',
  googleMapsUrl: 'https://maps.google.com/?q=老祥記',
  categories: ['テイクアウト']
}

const mockMap = {
  setCenter: jest.fn(),
  setZoom: jest.fn(),
}

describe('StoreMarker', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('店舗データからマーカーが正しく作成されること', () => {
    render(<StoreMarker store={mockStore} map={mockMap} />)
    
    expect(mockGoogleMaps.Marker).toHaveBeenCalledWith({
      position: mockStore.coordinates,
      map: mockMap,
      title: mockStore.name,
      icon: expect.objectContaining({
        url: expect.stringContaining('butaman'),
        scaledSize: expect.any(Object),
        anchor: expect.any(Object)
      })
    })
  })

  test('マーカーにクリックイベントリスナーが追加されること', () => {
    render(<StoreMarker store={mockStore} map={mockMap} />)
    
    expect(mockMarker.addListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function)
    )
  })

  test('マーカークリック時にonMarkerClick関数が呼ばれること', () => {
    const mockOnMarkerClick = jest.fn()
    
    render(
      <StoreMarker 
        store={mockStore} 
        map={mockMap} 
        onMarkerClick={mockOnMarkerClick}
      />
    )
    
    // マーカーのクリックイベントを模擬実行
    const clickHandler = mockMarker.addListener.mock.calls.find(
      call => call[0] === 'click'
    )?.[1]
    
    if (clickHandler) {
      clickHandler()
    }
    
    expect(mockOnMarkerClick).toHaveBeenCalledWith(mockStore)
  })

  test('カスタムアイコンが正しく設定されること', () => {
    render(<StoreMarker store={mockStore} map={mockMap} />)
    
    const markerCall = mockGoogleMaps.Marker.mock.calls[0][0]
    expect(markerCall.icon.url).toBe('/icons/butaman-marker.svg')
    expect(mockGoogleMaps.Size).toHaveBeenCalledWith(40, 40)
    expect(mockGoogleMaps.Point).toHaveBeenCalledWith(20, 40)
  })

  test('マーカーが正しい位置に配置されること', () => {
    render(<StoreMarker store={mockStore} map={mockMap} />)
    
    const markerCall = mockGoogleMaps.Marker.mock.calls[0][0]
    expect(markerCall.position).toEqual(mockStore.coordinates)
  })

  test('店舗名がマーカーのタイトルに設定されること', () => {
    render(<StoreMarker store={mockStore} map={mockMap} />)
    
    const markerCall = mockGoogleMaps.Marker.mock.calls[0][0]
    expect(markerCall.title).toBe(mockStore.name)
  })

  test('mapプロパティが変更された時にマーカーが更新されること', () => {
    const newMap = { setCenter: jest.fn(), setZoom: jest.fn() }
    const { rerender } = render(<StoreMarker store={mockStore} map={mockMap} />)
    
    rerender(<StoreMarker store={mockStore} map={newMap} />)
    
    expect(mockMarker.setMap).toHaveBeenCalledWith(newMap)
  })

  test('店舗データが変更された時にマーカーが更新されること', () => {
    const updatedStore = { ...mockStore, name: '更新された店舗名' }
    const { rerender } = render(<StoreMarker store={mockStore} map={mockMap} />)
    
    rerender(<StoreMarker store={updatedStore} map={mockMap} />)
    
    expect(mockMarker.setPosition).toHaveBeenCalledWith(updatedStore.coordinates)
  })

  test('コンポーネントアンマウント時にマーカーがクリーンアップされること', () => {
    const { unmount } = render(<StoreMarker store={mockStore} map={mockMap} />)
    
    unmount()
    
    expect(mockMarker.setMap).toHaveBeenCalledWith(null)
  })

  test('onMarkerClickが未提供でもエラーが発生しないこと', () => {
    expect(() => {
      render(<StoreMarker store={mockStore} map={mockMap} />)
    }).not.toThrow()
  })
})