import { useState, useMemo, useCallback } from 'react'
import { ExtendedStore } from '@/types/store'
import {
  UserPreferences,
  StoreMatchResult,
  DEFAULT_USER_PREFERENCES
} from '@/types/spectrum'
import { calculateAndSortMatches } from '@/lib/matching-calculator'

export interface UseMatchingFilterOptions {
  stores: ExtendedStore[]
  initialPreferences?: UserPreferences
  /** 最小マッチ度（0-100）。この値未満の店舗は結果から除外される */
  minScore?: number
}

export interface UseMatchingFilterReturn {
  preferences: UserPreferences
  setPreferences: (prefs: UserPreferences) => void
  updatePreference: (key: keyof UserPreferences, value: number) => void
  matchResults: StoreMatchResult[]
  resetPreferences: () => void
}

/**
 * フィルター式マッチング機能のカスタムフック
 *
 * @param options - フックのオプション
 * @returns マッチングフィルターの状態と操作メソッド
 */
export function useMatchingFilter(
  options: UseMatchingFilterOptions
): UseMatchingFilterReturn {
  const { stores, initialPreferences = DEFAULT_USER_PREFERENCES, minScore = 0 } = options

  // ユーザーの好み設定の状態
  const [preferences, setPreferencesState] = useState<UserPreferences>(initialPreferences)

  // 好み設定全体を更新
  const setPreferences = useCallback((newPrefs: UserPreferences) => {
    setPreferencesState(newPrefs)
  }, [])

  // 個別の軸を更新
  const updatePreference = useCallback(
    (key: keyof UserPreferences, value: number) => {
      setPreferencesState(prev => ({
        ...prev,
        [key]: value
      }))
    },
    []
  )

  // 好み設定をデフォルトにリセット
  const resetPreferences = useCallback(() => {
    setPreferencesState(DEFAULT_USER_PREFERENCES)
  }, [])

  // マッチング結果を計算（メモ化）
  const matchResults = useMemo(() => {
    const allResults = calculateAndSortMatches(stores, preferences)
    // minScore以上の店舗のみフィルタリング
    return allResults.filter(result => result.matchScore >= minScore)
  }, [stores, preferences, minScore])

  return {
    preferences,
    setPreferences,
    updatePreference,
    matchResults,
    resetPreferences
  }
}
