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
  /** 豚饅の特徴タグ */
  features: string[]
  /** 店舗・豚饅の説明文（オプション） */
  description?: string
  /** GoogleマップでのURL */
  googleMapsUrl: string
  /** サービス形態 */
  categories: StoreCategory[]
}

/**
 * 店舗のサービス形態の型定義
 */
export type StoreCategory = 'テイクアウト' | '店内飲食' | '通販'

/**
 * AI分析による豚饅特徴データ
 */
export interface FeatureAnalysis {
  /** 味の濃さ (0-10) */
  taste: number
  /** 食感 (0-10) */
  texture: number
  /** ボリューム (0-10) */
  size: number
  /** 価格満足度 (0-10) */
  priceValue: number
  /** 総合評価 (0-10) */
  atmosphere: number
}

/**
 * AI分析結果の包括データ
 */
export interface AIAnalysisData {
  /** 5軸特徴スコア */
  features: FeatureAnalysis
  /** 信頼度スコア (0-100%) */
  confidence: number
  /** 分析対象口コミ数 */
  reviewCount: number
  /** 分析実行日時 */
  analysisDate: string
}

/**
 * データ収集メタデータ
 */
export interface DataSourceMetadata {
  /** データ収集日時 */
  collectionDate: string
  /** 収集元URL */
  sourceUrl: string
  /** AI分析実施フラグ */
  isEnhanced: boolean
}

/**
 * AI分析機能拡張版の店舗型定義
 * 既存Store型との完全な後方互換性を保持
 */
export interface ExtendedStore extends Store {
  /** AI分析結果フィールド（オプション） */
  aiAnalysis?: AIAnalysisData
  /** データ収集メタデータ */
  dataSource: DataSourceMetadata
}