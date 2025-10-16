'use client'

import { useState } from 'react'
import { ExtendedStore } from '@/types/store'
import { RadarChart } from './RadarChart'

interface RadarChartComparisonProps {
  stores: ExtendedStore[]
}

export function RadarChartComparison({ stores }: RadarChartComparisonProps) {
  const [mode, setMode] = useState<'single' | 'comparison'>('single')
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([])

  const handleStoreToggle = (storeId: string) => {
    setSelectedStoreIds(prev => {
      if (prev.includes(storeId)) {
        return prev.filter(id => id !== storeId)
      } else {
        // 比較モードでは最大3店舗まで
        if (mode === 'comparison' && prev.length >= 3) {
          return prev
        }
        // 単一モードでは1店舗のみ
        if (mode === 'single') {
          return [storeId]
        }
        return [...prev, storeId]
      }
    })
  }

  const handleModeChange = (newMode: 'single' | 'comparison') => {
    setMode(newMode)
    if (newMode === 'single' && selectedStoreIds.length > 1) {
      setSelectedStoreIds([selectedStoreIds[0]])
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">店舗比較</h3>
        <p className="text-sm text-gray-600">AI分析による豚饅の特徴を比較できます</p>
      </div>

      {/* モード切り替え */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <button
            onClick={() => handleModeChange('single')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'single'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            単一表示
          </button>
          <button
            onClick={() => handleModeChange('comparison')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'comparison'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            比較表示
          </button>
        </div>
      </div>

      {/* 店舗選択エリア */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">
          {mode === 'single' ? '表示する店舗を選択' : '比較する店舗を選択（最大3店舗）'}
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
                  type={mode === 'single' ? 'radio' : 'checkbox'}
                  name={mode === 'single' ? 'selectedStore' : undefined}
                  checked={selectedStoreIds.includes(store.id)}
                  onChange={() => handleStoreToggle(store.id)}
                  disabled={
                    mode === 'comparison' && 
                    !selectedStoreIds.includes(store.id) && 
                    selectedStoreIds.length >= 3
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{store.name}</div>
                  <div className="text-xs text-gray-500">
                    信頼度: {store.aiAnalysis?.confidence}% | 
                    レビュー: {store.aiAnalysis?.reviewCount}件
                  </div>
                </div>
              </label>
            ))}
        </div>

        {mode === 'comparison' && selectedStoreIds.length >= 3 && (
          <div className="text-sm text-amber-600">
            ⚠️ 最大3店舗まで選択できます
          </div>
        )}
      </div>

      {/* チャート表示エリア */}
      <div className="border-t pt-6">
        {selectedStoreIds.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg mb-2">📊</div>
            <div>比較したい店舗を選択してください</div>
          </div>
        ) : (
          <RadarChart 
            stores={stores}
            mode={mode}
            selectedStoreIds={selectedStoreIds}
          />
        )}
      </div>
    </div>
  )
}