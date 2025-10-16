'use client'

import React, { useEffect, useState } from 'react'
import { ExtendedStore } from '@/types/store'
import StoreInfo from './StoreInfo'
import { RadarChartComparison } from './RadarChartComparison'

interface StoreModalProps {
  isOpen: boolean
  onClose: () => void
  store: ExtendedStore | null
  allStores?: ExtendedStore[]
}

type TabType = 'info' | 'analysis'

/**
 * 店舗詳細モーダルコンポーネント
 * 店舗の詳細情報とAI分析チャートを表示し、ユーザーの操作に応じて開閉する
 */
export default function StoreModal({ isOpen, onClose, store, allStores = [] }: StoreModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('info')
  // Escキーでモーダルを閉じる
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, onClose])

  // body要素のスクロールを制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // モーダルが開いていない、または店舗データがない場合は何も表示しない
  if (!isOpen || !store) {
    return null
  }

  // 背景クリック時のハンドラー
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      data-testid="modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {store.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="閉じる"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              店舗情報
            </button>
            {store?.aiAnalysis && (
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'analysis'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                AI分析・比較
              </button>
            )}
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="p-6">
          {activeTab === 'info' && (
            <StoreInfo store={store} />
          )}
          {activeTab === 'analysis' && store?.aiAnalysis && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  豚饅特徴分析
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI分析による味、食感、ボリュームなどの特徴比較
                </p>
              </div>
              <RadarChartComparison stores={allStores} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}