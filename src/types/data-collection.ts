import { ExtendedStore } from './store'
import { Coordinates } from './map'

/**
 * 生の店舗データ（収集直後の未検証データ）
 */
export interface RawStoreData {
  /** 店舗の一意識別子 */
  id: string
  /** 店舗名 */
  name: string
  /** 住所 */
  address: string
  /** 地図座標 */
  coordinates: Coordinates
  /** 所属する区 */
  district: string
  /** 営業時間 */
  businessHours: string
  /** 豚饅1個の価格（円） */
  price: number
  /** 豚饅の特徴タグ */
  features: string[]
  /** サービス形態 */
  categories: string[]
  /** 収集元URL */
  sourceUrl: string
  /** 説明文（オプション） */
  description?: string
  /** GoogleマップでのURL（オプション） */
  googleMapsUrl?: string
}

/**
 * 検証済みの店舗データ
 */
export interface ValidatedStoreData extends RawStoreData {
  /** 検証済みフラグ */
  isValidated: true
  /** 検証日時 */
  validatedAt: string
  /** 検証エラー（あれば） */
  validationErrors?: string[]
}

/**
 * Result型パターン（エラーハンドリング用）
 */
export type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E }

/**
 * データ収集エラーの種類
 */
export type CollectionErrorType = 
  | 'NETWORK_ERROR'
  | 'PARSING_ERROR'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'AUTHENTICATION_ERROR'

/**
 * データ収集エラー
 */
export interface CollectionError {
  /** エラーの種類 */
  type: CollectionErrorType
  /** エラーメッセージ */
  message: string
  /** 対象店舗ID */
  storeId?: string
  /** エラー発生日時 */
  timestamp: string
  /** 追加のエラー詳細 */
  details?: Record<string, unknown>
}

/**
 * AI分析エラーの種類
 */
export type AnalysisErrorType = 
  | 'API_LIMIT_EXCEEDED'
  | 'INVALID_RESPONSE'
  | 'INSUFFICIENT_DATA'
  | 'MODEL_ERROR'
  | 'TIMEOUT_ERROR'

/**
 * AI分析エラー
 */
export interface AnalysisError {
  /** エラーの種類 */
  type: AnalysisErrorType
  /** エラーメッセージ */
  message: string
  /** 対象店舗ID */
  storeId?: string
  /** エラー発生日時 */
  timestamp: string
  /** リトライ推奨時間（秒） */
  retryAfter?: number
}

/**
 * 店舗収集リクエスト
 */
export interface StoreCollectionRequest {
  /** 収集対象の店舗ID一覧 */
  storeIds: string[]
  /** 口コミデータも含めるか */
  includeReviews: boolean
  /** 分析の深度 */
  analysisDepth: 'basic' | 'detailed'
}

/**
 * 店舗収集レスポンス
 */
export interface StoreCollectionResponse {
  /** 収集された店舗データ */
  stores: ExtendedStore[]
  /** 収集メタデータ */
  collectionMetadata: {
    /** 収集日時 */
    timestamp: string
    /** 成功した店舗数 */
    successCount: number
    /** エラーが発生した店舗数 */
    errorCount: number
    /** エラー詳細 */
    errors: CollectionError[]
  }
}