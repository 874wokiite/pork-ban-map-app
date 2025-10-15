import React from 'react'
import { Store } from '@/types/store'

interface StoreInfoProps {
  store: Store
}

/**
 * 店舗情報表示コンポーネント
 * 店舗の詳細情報（住所、営業時間、価格、特徴など）を表示
 */
export default function StoreInfo({ store }: StoreInfoProps) {
  return (
    <div className="space-y-6">
      {/* 基本情報セクション */}
      <div className="space-y-4">
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

          {/* 価格 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
              価格
            </h3>
            <p className="text-gray-900 dark:text-white font-semibold">
              ¥{store.price}
            </p>
          </div>

          {/* 電話番号（オプション） */}
          {store.phone && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                電話番号
              </h3>
              <p className="text-gray-900 dark:text-white">
                {store.phone}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 特徴タグ */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
          特徴
        </h3>
        <div className="flex flex-wrap gap-2">
          {store.features.map((feature, index) => (
            <span
              key={index}
              className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* サービス形態 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
          サービス形態
        </h3>
        <div className="flex flex-wrap gap-2">
          {store.categories.map((category, index) => (
            <span
              key={index}
              className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* 説明文（オプション） */}
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

      {/* 外部リンク */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Googleマップリンク */}
        <a
          href={store.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2C6.69 2 4 4.69 4 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.31-2.69-6-6-6zm0 8.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Googleマップで開く
        </a>

        {/* 公式サイトリンク（オプション） */}
        {store.website && (
          <a
            href={store.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2l1.85 3.75L16 6.5l-3 2.93.71 4.07L10 11.75 6.29 13.5 7 9.43 4 6.5l4.15-.75L10 2z"/>
            </svg>
            公式サイト
          </a>
        )}
      </div>
    </div>
  )
}