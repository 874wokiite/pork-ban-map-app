'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      data-testid="modal-backdrop"
      onClick={handleBackdropClick}
    >
      {/* モーダル本体 */}
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-lg mx-4 max-h-[90vh] rounded-2xl flex flex-col overflow-hidden" style={{ fontFamily: 'var(--font-zen-maru-gothic)' }}>
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="filter-modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
            ぴったりな豚饅を探そう！
          </h2>
          <button
            type="button"
            aria-label="閉じる"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto">
          {/* 好み設定セクション */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">あなたの好みは？</h3>
              <button
                type="button"
                onClick={resetPreferences}
                className="text-xs text-accent-green hover:text-accent-green/80 font-medium"
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
          <div className="px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
              おすすめ店舗 ({matchResults.length}件)
            </h3>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {matchResults.map((result, index) => (
                  <motion.button
                    key={result.store.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      layout: { type: 'spring', stiffness: 500, damping: 35 },
                      opacity: { duration: 0.2 },
                      delay: index * 0.02
                    }}
                    type="button"
                    onClick={() => handleStoreClick(result.store)}
                    className="w-full text-left bg-white dark:bg-gray-800 border border-accent-green hover:bg-accent-green/10 dark:hover:bg-accent-green/20 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src="/icons/ban-logo.svg" alt="" className="w-6 h-6" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{result.store.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{result.store.district}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.matchScore >= 85 && (
                          <span className="relative text-xs bg-gray-900 text-white px-2 py-0.5 rounded font-medium">
                            おすすめ
                            <span className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
                          </span>
                        )}
                        <span className={`font-bold ${
                          result.matchScore >= 85
                            ? 'text-primary'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {Math.round(result.matchScore)}%
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>

              {matchResults.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
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
