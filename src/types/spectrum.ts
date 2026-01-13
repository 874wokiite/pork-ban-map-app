import type { ExtendedStore, FeatureAnalysis } from './store'

/**
 * 対比スタイル4軸評価のデータ構造
 * 従来のレーダーチャート（5軸）から新しいスペクトラム表示用に移行
 */
export interface SpectrumFeatureAnalysis {
  /** 皮のスタイル: 薄皮ふわふわ(1-3) ↔ 厚皮もちもち(7-10) */
  skinStyle: number
  /** 餡のスタイル: あっさり野菜多め(1-3) ↔ こってり肉感強め(7-10) */
  fillingStyle: number
  /** 全体の味わい: 優しい味上品(1-3) ↔ パンチのある味濃いめ(7-10) */
  overallTaste: number
  /** サイズ: 小ぶり食べ歩き向き(1-3) ↔ 大ぶり満足感(7-10) */
  size: number
}

/**
 * スペクトラムバーの軸設定
 */
export interface SpectrumAxisConfig {
  /** 評価軸のキー */
  key: keyof SpectrumFeatureAnalysis
  /** 左端ラベル（低い値） */
  leftLabel: string
  /** 右端ラベル（高い値） */
  rightLabel: string
}

/**
 * 4軸評価の設定定義
 */
export const SPECTRUM_AXES: SpectrumAxisConfig[] = [
  { key: 'skinStyle', leftLabel: '薄皮ふわふわ', rightLabel: '厚皮もちもち' },
  { key: 'fillingStyle', leftLabel: 'あっさり', rightLabel: 'こってり' },
  { key: 'overallTaste', leftLabel: '優しい味', rightLabel: 'パンチ' },
  { key: 'size', leftLabel: '小ぶり', rightLabel: '大ぶり' }
]

/**
 * ユーザーの好み設定
 * スライダーで設定する各軸の値
 */
export interface UserPreferences {
  skinStyle: number
  fillingStyle: number
  overallTaste: number
  size: number
}

/**
 * デフォルトのユーザー好み設定（中央値）
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  skinStyle: 5,
  fillingStyle: 5,
  overallTaste: 5,
  size: 5
}

/**
 * 店舗のマッチング結果
 */
export interface StoreMatchResult {
  /** 店舗情報 */
  store: ExtendedStore
  /** マッチ度スコア (0-100) */
  matchScore: number
}

/**
 * SpectrumFeatureAnalysis形式かどうかを判定する型ガード
 */
export function isSpectrumFeatureAnalysis(
  features: SpectrumFeatureAnalysis | FeatureAnalysis
): features is SpectrumFeatureAnalysis {
  return (
    'skinStyle' in features &&
    'fillingStyle' in features &&
    'overallTaste' in features &&
    'size' in features &&
    !('taste' in features)
  )
}
