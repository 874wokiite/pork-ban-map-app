import { Store } from './store'

/**
 * 地図コンポーネントの状態管理型定義
 */
export interface MapState {
  /** 表示する店舗データの配列 */
  stores: Store[]
  /** 現在選択されている店舗（詳細表示用） */
  selectedStore: Store | null
  /** 地図の中心座標 */
  mapCenter: Coordinates
  /** 地図のズームレベル */
  mapZoom: number
  /** データ読み込み中フラグ */
  isLoading: boolean
}

/**
 * 座標情報の型定義
 */
export interface Coordinates {
  /** 緯度 */
  lat: number
  /** 経度 */
  lng: number
}