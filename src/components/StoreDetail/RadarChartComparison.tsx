'use client'

import { useState } from 'react'
import { ExtendedStore } from '@/types/store'
import { RadarChart } from './RadarChart'

interface RadarChartComparisonProps {
  stores: ExtendedStore[]
  onStoreSelect?: (store: ExtendedStore) => void
}

export function RadarChartComparison({ stores, onStoreSelect }: RadarChartComparisonProps) {
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>(['roushouki'])

  const handleStoreToggle = (storeId: string) => {
    setSelectedStoreIds(prev => {
      if (prev.includes(storeId)) {
        return prev.filter(id => id !== storeId)
      } else {
        // 比較モードでは最大3店舗まで
        if (prev.length >= 3) {
          return prev
        }
        return [...prev, storeId]
      }
    })
  }

  return (
    <div className="space-y-6">

      {/* チャート表示エリア */}
      <div>
        <RadarChart 
          stores={stores}
          mode="comparison"
          selectedStoreIds={selectedStoreIds}
        />
      </div>

      {/* 店舗選択エリア */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          比較する店舗を選択（最大3店舗）
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {stores
            .filter(store => store.aiAnalysis)
            .map((store) => (
              <label
                key={store.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStoreIds.includes(store.id)}
                  onChange={() => handleStoreToggle(store.id)}
                  disabled={
                    !selectedStoreIds.includes(store.id) && 
                    selectedStoreIds.length >= 3
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{store.name}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStoreSelect?.(store)
                  }}
                  className="hover:opacity-70 transition-opacity"
                  aria-label={`${store.name}の詳細を開く`}
                  title="店舗詳細を開く"
                >
                  <img 
                    src="/icons/ban-logo.svg" 
                    alt="店舗詳細" 
                    className="w-5 h-5"
                  />
                </button>
              </label>
            ))}
        </div>

        {selectedStoreIds.length >= 3 && (
          <div className="text-sm text-primary-light dark:text-primary-light">
            ⚠️ 最大3店舗まで選択できます
          </div>
        )}
      </div>
    </div>
  )
}