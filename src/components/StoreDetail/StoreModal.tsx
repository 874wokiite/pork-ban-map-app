'use client'

import React, { useEffect } from 'react'
import { ExtendedStore } from '@/types/store'
import { SingleStoreRadarChart } from './SingleStoreRadarChart'
import ServiceTypeIcon from '@/components/ServiceTypeIcon'

interface StoreModalProps {
  isOpen: boolean
  onClose: () => void
  store: ExtendedStore | null
}

/**
 * 店舗詳細モーダルコンポーネント
 * 店舗の詳細情報、レーダーチャート、特典を表示し、ユーザーの操作に応じて開閉する
 */
export default function StoreModal({ isOpen, onClose, store }: StoreModalProps) {
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

        {/* コンテンツ */}
        <div className="p-6">
          <div className="space-y-6">
            {/* 1. 豚饅特徴分析（レーダーチャート） */}
            {store?.aiAnalysis && (
              <div>
                <SingleStoreRadarChart store={store} />
              </div>
            )}
            
            {/* 2. 説明文 */}
            {store.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  説明
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {store.description}
                </p>
              </div>
            )}

            {/* 3. 住所と営業時間（横並び） */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 住所 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  住所
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {store.address}
                </p>
              </div>

              {/* 営業時間 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  営業時間
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {store.businessHours}
                </p>
              </div>
            </div>

            {/* 5. 特徴 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                特徴
              </h3>
              <div className="flex flex-wrap gap-2">
                {store.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. サービス形態 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                サービス形態
              </h3>
              <div className="flex flex-wrap gap-3">
                {store.categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <ServiceTypeIcon serviceType={category} />
                    <span className="text-black text-sm font-medium">
                      {category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. 特典・サービス（最後） */}
            {store?.benefits && store.benefits.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  特典・サービス
                </h3>
                <div className="space-y-2">
                  {store.benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <div className="text-green-600 dark:text-green-400 mr-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-900 dark:text-white">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Googleマップリンク */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href={store.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-accent-green text-white rounded-md hover:bg-accent-green/80 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2C6.69 2 4 4.69 4 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.31-2.69-6-6-6zm0 8.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Googleマップで開く
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}