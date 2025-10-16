'use client'

import { useState } from 'react'
import { ExtendedStore } from '@/types/store'
import { RadarChart } from './RadarChart'

interface RadarChartComparisonProps {
  stores: ExtendedStore[]
}

export function RadarChartComparison({ stores }: RadarChartComparisonProps) {
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
      {/* ヘッダー */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">店舗比較</h3>
        <p className="text-sm text-gray-600">AI分析による豚饅の特徴を比較できます</p>
      </div>

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
        <div className="text-sm font-medium text-gray-700">
          比較する店舗を選択（最大3店舗）
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {stores
            .filter(store => store.aiAnalysis)
            .map((store) => (
              <label
                key={store.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
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
                  <div className="font-medium text-gray-900">{store.name}</div>
                </div>
                <a
                  href={store.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 transition-colors"
                  aria-label={`${store.name}をGoogleマップで開く`}
                  title="Googleマップで開く"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2C6.69 2 4 4.69 4 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.31-2.69-6-6-6zm0 8.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </a>
              </label>
            ))}
        </div>

        {selectedStoreIds.length >= 3 && (
          <div className="text-sm text-amber-600">
            ⚠️ 最大3店舗まで選択できます
          </div>
        )}
      </div>
    </div>
  )
}