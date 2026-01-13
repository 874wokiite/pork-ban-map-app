import { ExtendedStore } from '@/types/store'
import {
  UserPreferences,
  StoreMatchResult,
  SpectrumFeatureAnalysis,
  isSpectrumFeatureAnalysis
} from '@/types/spectrum'

/**
 * 単一店舗のマッチ度を計算
 *
 * 計算アルゴリズム:
 * 1. 各軸の差分を計算: diff = |userPref - storeValue|
 * 2. 各軸の類似度を計算: similarity = 1 - (diff / 9) (最大差分は9)
 * 3. 4軸の平均を計算: avgSimilarity = sum(similarities) / 4
 * 4. パーセンテージに変換: matchScore = avgSimilarity * 100
 *
 * @param store 評価対象店舗
 * @param preferences ユーザーの好み
 * @returns 0-100のマッチ度スコア
 */
export function calculateMatchScore(
  store: ExtendedStore,
  preferences: UserPreferences
): number {
  // aiAnalysisデータがない場合は0を返す
  if (!store.aiAnalysis) {
    return 0
  }

  const features = store.aiAnalysis.features

  // SpectrumFeatureAnalysis形式でない場合は0を返す
  if (!isSpectrumFeatureAnalysis(features)) {
    return 0
  }

  const spectrumFeatures = features as SpectrumFeatureAnalysis
  const axes: (keyof SpectrumFeatureAnalysis)[] = ['skinStyle', 'fillingStyle', 'overallTaste', 'size']

  // 最大差分（1から10の範囲なので9）
  const maxDiff = 9

  // 各軸の類似度を計算
  const similarities = axes.map(axis => {
    const diff = Math.abs(preferences[axis] - spectrumFeatures[axis])
    const similarity = 1 - (diff / maxDiff)
    return similarity
  })

  // 平均類似度を計算
  const avgSimilarity = similarities.reduce((sum, s) => sum + s, 0) / similarities.length

  // パーセンテージに変換（小数点2桁で丸める）
  const matchScore = Math.round(avgSimilarity * 10000) / 100

  return matchScore
}

/**
 * 複数店舗のマッチ度を計算してソート
 * aiAnalysisデータがない店舗は除外される
 *
 * @param stores 店舗リスト
 * @param preferences ユーザーの好み
 * @returns マッチ度降順のStoreMatchResult配列
 */
export function calculateAndSortMatches(
  stores: ExtendedStore[],
  preferences: UserPreferences
): StoreMatchResult[] {
  // マッチ度を計算（aiAnalysisがない店舗は除外）
  const results: StoreMatchResult[] = stores
    .filter(store => store.aiAnalysis && isSpectrumFeatureAnalysis(store.aiAnalysis.features))
    .map(store => ({
      store,
      matchScore: calculateMatchScore(store, preferences)
    }))

  // マッチ度の高い順にソート
  results.sort((a, b) => b.matchScore - a.matchScore)

  return results
}
