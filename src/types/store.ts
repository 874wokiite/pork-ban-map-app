import { Coordinates } from './map'

/**
 * 神戸豚饅サミット参加店舗の型定義
 */
export interface Store {
  /** 店舗の一意識別子 */
  id: string
  /** 店舗名 */
  name: string
  /** 住所（郵便番号含む） */
  address: string
  /** 地図座標 */
  coordinates: Coordinates
  /** 所属する区 */
  district: string
  /** 営業時間（定休日含む） */
  businessHours: string
  /** 豚饅1個の価格（円） */
  price: number
  /** 豚饅の特徴タグ */
  features: string[]
  /** 店舗・豚饅の説明文（オプション） */
  description?: string
  /** 店舗・豚饅の画像URL配列 */
  images: string[]
  /** 電話番号（オプション） */
  phone?: string
  /** 公式サイトまたはSNS URL（オプション） */
  website?: string
  /** GoogleマップでのURL */
  googleMapsUrl: string
  /** サービス形態 */
  categories: StoreCategory[]
}

/**
 * 店舗のサービス形態の型定義
 */
export type StoreCategory = 'テイクアウト' | '店内飲食' | '通販'