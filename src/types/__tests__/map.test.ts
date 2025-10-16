import { MapState } from '../map'
import { Store } from '../store'

describe('MapState型定義', () => {
  const mockStore: Store = {
    id: 'test-store',
    name: 'テスト店舗',
    address: '〒650-0001 兵庫県神戸市中央区test',
    coordinates: {
      lat: 34.6937,
      lng: 135.5023
    },
    district: '中央区',
    businessHours: '10:00-18:00',
    features: ['テスト特徴'],
    googleMapsUrl: 'https://maps.google.com/?q=test',
    categories: ['テイクアウト']
  }

  it('MapState型が正しい構造を持つ', () => {
    const mockMapState: MapState = {
      stores: [mockStore],
      selectedStore: null,
      mapCenter: { lat: 34.6937, lng: 135.5023 },
      mapZoom: 12,
      isLoading: false
    }

    // 型チェック用の関数
    const validateMapState = (state: MapState): boolean => {
      return (
        Array.isArray(state.stores) &&
        (state.selectedStore === null || typeof state.selectedStore === 'object') &&
        typeof state.mapCenter.lat === 'number' &&
        typeof state.mapCenter.lng === 'number' &&
        typeof state.mapZoom === 'number' &&
        typeof state.isLoading === 'boolean'
      )
    }

    expect(validateMapState(mockMapState)).toBe(true)
  })

  it('selectedStoreがnullまたはStore型を受け入れる', () => {
    const stateWithNull: MapState = {
      stores: [],
      selectedStore: null,
      mapCenter: { lat: 34.6937, lng: 135.5023 },
      mapZoom: 12,
      isLoading: false
    }

    const stateWithStore: MapState = {
      stores: [mockStore],
      selectedStore: mockStore,
      mapCenter: { lat: 34.6937, lng: 135.5023 },
      mapZoom: 12,
      isLoading: false
    }

    expect(stateWithNull.selectedStore).toBeNull()
    expect(stateWithStore.selectedStore).toEqual(mockStore)
  })

  it('mapCenterが座標オブジェクトの構造を持つ', () => {
    const mapState: MapState = {
      stores: [],
      selectedStore: null,
      mapCenter: { lat: 34.6937, lng: 135.5023 },
      mapZoom: 12,
      isLoading: false
    }

    expect(typeof mapState.mapCenter.lat).toBe('number')
    expect(typeof mapState.mapCenter.lng).toBe('number')
    expect(mapState.mapCenter.lat).toBeGreaterThan(0)
    expect(mapState.mapCenter.lng).toBeGreaterThan(0)
  })
})