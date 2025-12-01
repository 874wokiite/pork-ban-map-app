'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { loadGoogleMapsAPI } from '@/lib/google-maps'
import { ExtendedStore } from '@/types/store'
import { getExtendedStoresData } from '@/lib/store-data'
import StoreModal from '@/components/StoreDetail/StoreModal'
import AIAnalysisModal from '@/components/AIAnalysisModal'

// MapWithStoresを動的にインポート（SSR無効）
const MapWithStores = dynamic(() => import('@/components/MapWithStores'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-120px)] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <div className="text-gray-500">地図を読み込み中...</div>
      </div>
    </div>
  )
})

export default function Home() {
  const [isMapReady, setIsMapReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedStore, setSelectedStore] = useState<ExtendedStore | null>(null)
  const [allStores, setAllStores] = useState<ExtendedStore[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAIAnalysisModalOpen, setIsAIAnalysisModalOpen] = useState(false)

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

  // 店舗データを読み込み
  useEffect(() => {
    const loadStores = async () => {
      try {
        const stores = await getExtendedStoresData()
        setAllStores(stores)
      } catch (error) {
        console.error('店舗データ読み込みエラー:', error)
      }
    }
    
    loadStores()
  }, [])

  // 店舗クリック時のハンドラー（useCallbackで安定化）
  const handleStoreClick = useCallback((store: ExtendedStore) => {
    console.log('店舗クリック:', store.name);
    setSelectedStore(store)
    setIsModalOpen(true)
  }, [])

  // モーダル閉じるハンドラー
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedStore(null)
  }, [])

  // AI分析モーダル開くハンドラー
  const handleOpenAIAnalysisModal = useCallback(() => {
    setIsAIAnalysisModalOpen(true)
  }, [])

  // AI分析モーダル閉じるハンドラー
  const handleCloseAIAnalysisModal = useCallback(() => {
    setIsAIAnalysisModalOpen(false)
  }, [])

  // AI分析モーダルから店舗選択時のハンドラー
  const handleStoreSelectFromAIModal = useCallback((store: ExtendedStore) => {
    setIsAIAnalysisModalOpen(false)
    setSelectedStore(store)
    setIsModalOpen(true)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ヘッダー */}
      <header className="bg-accent-green flex justify-center items-center sm:items-end px-4 sm:px-0">
        <img
          src="/images/girl-kanon-up.png"
          alt="かのん"
          className="w-1/4 sm:w-auto sm:h-16 md:h-20 object-contain"
        />
        <img
          src="/images/kobe-ban-service-logo.png"
          alt="神戸豚饅マップ"
          className="w-1/2 sm:w-auto sm:h-16 md:h-24 object-contain"
        />
        <img
          src="/images/girl-saki-up.png"
          alt="さき"
          className="w-1/4 sm:w-auto sm:h-16 md:h-20 object-contain"
        />
      </header>

      {/* マーキー帯 */}
      <div className="bg-black text-white text-xs py-1 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block font-bold">
          神戸豚饅MAPどんどんアプデ中！お楽しみに！　豚饅アイコンをクリックすると店舗の詳細情報を確認できます。
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4">
          <strong>エラー:</strong> {error}
        </div>
      )}

      {/* 地図表示エリア */}
      <div className="w-full">
        {isMapReady ? (
          <MapWithStores 
            className="w-full h-[calc(100vh-120px)]"
            onStoreClick={handleStoreClick}
            onSearchClick={handleOpenAIAnalysisModal}
          />
        ) : (
          <div className="w-full h-[calc(100vh-120px)] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <div className="text-gray-500">Google Maps APIを読み込み中...</div>
            </div>
          </div>
        )}
      </div>

      {/* 店舗詳細モーダル */}
      <StoreModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        store={selectedStore}
      />

      {/* AI分析モーダル */}
      <AIAnalysisModal
        isOpen={isAIAnalysisModalOpen}
        onClose={handleCloseAIAnalysisModal}
        allStores={allStores}
        onStoreSelect={handleStoreSelectFromAIModal}
      />
    </div>
  )
}
