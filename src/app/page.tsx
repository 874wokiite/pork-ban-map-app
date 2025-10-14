'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { loadGoogleMapsAPI } from '@/lib/google-maps'

// MapContainerを動的にインポート（SSR無効）
const MapContainer = dynamic(() => import('@/components/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-gray-500">地図を読み込み中...</div>
    </div>
  )
})

export default function Home() {
  const [isMapReady, setIsMapReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Google Maps APIを読み込み
    loadGoogleMapsAPI()
      .then(() => {
        setIsMapReady(true)
      })
      .catch((err) => {
        console.error('Google Maps API読み込みエラー:', err)
        setError(err.message)
      })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ヘッダー */}
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">神戸豚饅マップ</h1>
          <p className="text-sm opacity-90">神戸豚饅サミット参加店舗を探そう</p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto p-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">店舗マップ</h2>
          <p className="text-gray-600 dark:text-gray-400">
            神戸豚饅サミット参加店舗の位置を地図で確認できます
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>エラー:</strong> {error}
          </div>
        )}

        {/* 地図表示エリア */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          {isMapReady ? (
            <MapContainer className="h-[500px]" />
          ) : (
            <div className="h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <div className="text-gray-500">Google Maps APIを読み込み中...</div>
              </div>
            </div>
          )}
        </div>

        {/* 説明 */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            このマップには神戸豚饅サミット参加店舗が表示されます。
            店舗マーカーをクリックすると詳細情報を確認できます。
          </p>
        </div>
      </main>
    </div>
  )
}
