'use client'

import { useEffect, useCallback } from 'react'
import { ExtendedStore } from '@/types/store'
import { SPECTRUM_AXES } from '@/types/spectrum'
import { useMatchingFilter } from '@/hooks/useMatchingFilter'
import SpectrumBar from '@/components/SpectrumBar'

export interface FilterMatchingModalProps {
  isOpen: boolean
  onClose: () => void
  stores: ExtendedStore[]
  onStoreSelect: (store: ExtendedStore) => void
  /** 最小マッチ度（デフォルト: 70）。この値未満の店舗は結果から除外される */
  minScore?: number
}

/**
 * フィルター式マッチングモーダル
 * ユーザーの好みを設定して店舗をマッチング
 */
export default function FilterMatchingModal({
  isOpen,
  onClose,
  stores,
  onStoreSelect,
  minScore = 70
}: FilterMatchingModalProps) {
  const {
    preferences,
    updatePreference,
    matchResults,
    resetPreferences
  } = useMatchingFilter({ stores, minScore })

  // Escキーでモーダルを閉じる
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // bodyのスクロールを無効化
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) {
    return null
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleStoreClick = (store: ExtendedStore) => {
    onStoreSelect(store)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      {/* 背景オーバーレイ */}
      <div
        data-testid="modal-backdrop"
        className="absolute inset-0 bg-black/50"
        onClick={handleBackdropClick}
      />

      {/* モーダル本体 */}
      <div className="relative bg-white w-full sm:max-w-lg sm:mx-4 max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 id="filter-modal-title" className="text-lg font-bold text-gray-900">
            好みで探す
          </h2>
          <button
            type="button"
            aria-label="閉じる"
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto">
          {/* 好み設定セクション */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">あなたの好みを教えてください</h3>
              <button
                type="button"
                onClick={resetPreferences}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium"
              >
                リセット
              </button>
            </div>
            <div className="space-y-2">
              {SPECTRUM_AXES.map((axis) => (
                <SpectrumBar
                  key={axis.key}
                  axis={axis}
                  value={preferences[axis.key]}
                  onChange={(value) => updatePreference(axis.key, value)}
                />
              ))}
            </div>
          </div>

          {/* マッチング結果セクション */}
          <div className="px-4 py-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              おすすめ店舗 ({matchResults.length}件)
            </h3>
            <div className="space-y-2">
              {matchResults.map((result) => (
                <button
                  key={result.store.id}
                  type="button"
                  onClick={() => handleStoreClick(result.store)}
                  className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{result.store.name}</div>
                      <div className="text-xs text-gray-500">{result.store.district}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600 font-bold">
                        {Math.round(result.matchScore)}%
                      </span>
                      <span className="text-xs text-gray-400">マッチ</span>
                    </div>
                  </div>
                </button>
              ))}

              {matchResults.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  マッチする店舗がありません
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
