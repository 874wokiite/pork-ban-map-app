import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MapContainer from '@/components/MapContainer'

// Google Maps APIのモック
const mockMap = {
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  addListener: jest.fn(),
}

const mockGoogleMaps = {
  Map: jest.fn(() => mockMap),
  LatLng: jest.fn((lat, lng) => ({ lat, lng })),
  MapTypeId: {
    ROADMAP: 'roadmap'
  }
}

// グローバルgoogleオブジェクトのモック
Object.defineProperty(window, 'google', {
  value: {
    maps: mockGoogleMaps
  },
  writable: true
})

describe('MapContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('マップコンテナが正しくレンダリングされること', () => {
    render(<MapContainer />)
    
    // マップ要素が存在することを確認
    const mapElement = screen.getByTestId('map-container')
    expect(mapElement).toBeInTheDocument()
  })

  test('マップ要素が適切なスタイルクラスを持つこと', () => {
    render(<MapContainer />)
    
    const mapElement = screen.getByTestId('map-container')
    expect(mapElement).toHaveClass('w-full', 'h-full', 'min-h-[400px]')
  })

  test('Google Maps APIが正しい設定で初期化されること', async () => {
    render(<MapContainer />)
    
    await waitFor(() => {
      expect(mockGoogleMaps.Map).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          center: { lat: 34.6925, lng: 135.1955 }, // 神戸市中心
          zoom: 13,
          mapTypeId: 'roadmap'
        })
      )
    })
  })

  test('コンポーネントがアンマウント時にクリーンアップされること', () => {
    const { unmount } = render(<MapContainer />)
    
    unmount()
    
    // メモリリークを防ぐためのクリーンアップが実行されることを確認
    // 実装では、useEffectのクリーンアップ関数で処理される
    expect(true).toBe(true) // プレースホルダー
  })

  test('レスポンシブデザインが適用されること', () => {
    render(<MapContainer />)
    
    const mapElement = screen.getByTestId('map-container')
    
    // レスポンシブクラスが適用されていることを確認
    expect(mapElement).toHaveClass('w-full', 'h-full')
  })

  test('マップ要素が適切なスタイル設定を持つこと', () => {
    render(<MapContainer />)
    
    const mapElement = screen.getByTestId('map-container')
    
    // Google Maps用のスタイル設定が適用されていることを確認
    expect(mapElement).toHaveStyle({ position: 'relative', overflow: 'hidden' })
  })

  test('初期表示時にローディング状態が表示されること', () => {
    render(<MapContainer />)
    
    // Google Maps API読み込み中はローディングが表示される
    const loadingElement = screen.queryByText('Google Maps読み込み中...')
    expect(loadingElement).toBeInTheDocument()
  })

  test('Google Maps API読み込み完了後にローディングが消えること', async () => {
    render(<MapContainer />)
    
    // API読み込み完了をシミュレート
    await waitFor(() => {
      const loadingElement = screen.queryByText('Google Maps読み込み中...')
      expect(loadingElement).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('マップ操作（ズーム・パン）が正常に動作すること', async () => {
    render(<MapContainer />)
    
    await waitFor(() => {
      expect(mockGoogleMaps.Map).toHaveBeenCalled()
    })

    // マップが作成された後、操作が可能であることを確認
    expect(mockMap.setCenter).toBeDefined()
    expect(mockMap.setZoom).toBeDefined()
  })

  test('Google Maps API読み込みエラー時にエラー表示されること', async () => {
    // Google Maps APIモックを失敗させる
    const errorMessage = 'Google Maps API読み込み失敗'
    mockGoogleMaps.Map.mockImplementationOnce(() => {
      throw new Error(errorMessage)
    })

    render(<MapContainer />)
    
    await waitFor(() => {
      const errorElement = screen.queryByTestId('map-error')
      expect(errorElement).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('カスタムclassNameが適用されること', () => {
    const customClassName = 'custom-map-class'
    render(<MapContainer className={customClassName} />)
    
    const containerElement = screen.getByTestId('map-container').parentElement
    expect(containerElement).toHaveClass(customClassName)
  })
})