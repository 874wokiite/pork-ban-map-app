'use client'

import { useState, useCallback } from 'react'
import { ResponsiveContainer, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts'
import { ExtendedStore, FeatureAnalysis } from '@/types/store'

interface RadarChartEnhancedProps {
  stores: ExtendedStore[]
  selectedStoreIds: string[]
  isLoading?: boolean
  error?: string
  showTooltip?: boolean
  animationEnabled?: boolean
  onRetry?: () => void
}

interface ChartDataPoint {
  axis: string
  [storeName: string]: string | number
}

const chartLabels = [
  { key: 'taste', label: '味の濃さ', description: '豚饅の味の強さや深み' },
  { key: 'texture', label: '食感', description: '皮と餡の食感バランス' },
  { key: 'size', label: 'ボリューム', description: '1個あたりのサイズと満足感' },
  { key: 'priceValue', label: '価格満足度', description: '価格に対する価値の高さ' },
  { key: 'atmosphere', label: '総合評価', description: '店舗と商品の総合的な評価' }
] as const

const colors = ['#8884d8', '#82ca9d', '#ffc658']

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-gray-500">チャートを読み込み中...</span>
  </div>
)

const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center h-64 text-red-500">
    <div className="text-lg mb-2">⚠️</div>
    <div className="text-center mb-4">{message}</div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        再試行
      </button>
    )}
  </div>
)

interface EnhancedTooltipPayload {
  color: string
  dataKey: string
  value: number
}

interface EnhancedTooltipProps {
  active?: boolean
  payload?: EnhancedTooltipPayload[]
  label?: string
}

const EnhancedTooltip = ({ active, payload, label }: EnhancedTooltipProps) => {
  if (active && payload && payload.length) {
    const labelInfo = chartLabels.find(l => l.label === label)
    
    return (
      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg max-w-xs">
        <div className="font-semibold text-gray-800 mb-2">{label}</div>
        {labelInfo && (
          <div className="text-xs text-gray-600 mb-3">{labelInfo.description}</div>
        )}
        {payload.map((entry, index: number) => (
          <div key={index} className="flex justify-between items-center mb-1">
            <span style={{ color: entry.color }} className="font-medium">
              {entry.dataKey}
            </span>
            <span className="font-bold">{entry.value}/10</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function RadarChartEnhanced({ 
  stores, 
  selectedStoreIds, 
  isLoading = false,
  error,
  showTooltip = true,
  animationEnabled = true,
  onRetry
}: RadarChartEnhancedProps) {
  const [hoveredStore, setHoveredStore] = useState<string | null>(null)

  const selectedStores = stores.filter(store => selectedStoreIds.includes(store.id))
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLegendMouseEnter = useCallback((data: any) => {
    if (data.value) {
      setHoveredStore(data.value)
    }
  }, [])

  const handleLegendMouseLeave = useCallback(() => {
    setHoveredStore(null)
  }, [])

  // ローディング状態
  if (isLoading) {
    return <LoadingSpinner />
  }

  // エラー状態
  if (error) {
    return <ErrorDisplay message={error} onRetry={onRetry} />
  }

  // AI分析データがない場合の処理
  const hasAnalysisData = selectedStores.some(store => store.aiAnalysis)
  
  if (!hasAnalysisData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-lg mb-2">📊</div>
          <div>AI分析データがありません</div>
          <div className="text-sm text-gray-400 mt-1">
            店舗の特徴分析が完了すると表示されます
          </div>
        </div>
      </div>
    )
  }

  // 最大3店舗まで表示
  const displayStores = selectedStores.slice(0, 3)

  // レーダーチャート用データの変換
  const chartData: ChartDataPoint[] = chartLabels.map(({ key, label }) => {
    const dataPoint: ChartDataPoint = { axis: label }
    
    displayStores.forEach((store) => {
      if (store.aiAnalysis) {
        dataPoint[store.name] = store.aiAnalysis.features[key as keyof FeatureAnalysis]
      }
    })
    
    return dataPoint
  })

  return (
    <div 
      className="w-full space-y-4"
      data-testid="enhanced-radar-chart"
      role="img"
      aria-label={`${displayStores.map(s => s.name).join('、')}の豚饅特徴比較チャート`}
    >
      {/* 表示制限の警告 */}
      {selectedStores.length > 3 && (
        <div className="text-sm text-primary-light bg-primary-light/10 p-3 rounded-lg border border-primary-light/20">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <span>比較表示は最大3店舗までです。最初の3店舗を表示しています。</span>
          </div>
        </div>
      )}
      
      <div className="w-full h-96 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="75%" 
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid 
              className="stroke-gray-200" 
              strokeWidth={1}
            />
            <PolarAngleAxis 
              dataKey="axis" 
              tick={{ 
                fontSize: 12, 
                fill: '#374151',
                textAnchor: 'middle'
              }}
              className="text-gray-700 font-medium"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ 
                fontSize: 10, 
                fill: '#6B7280',
                textAnchor: 'middle'
              }}
              tickCount={6}
              axisLine={false}
            />
            {showTooltip && <Tooltip content={<EnhancedTooltip />} />}
            {displayStores.map((store, index) => (
              store.aiAnalysis && (
                <Radar
                  key={store.id}
                  name={store.name}
                  dataKey={store.name}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={hoveredStore === store.name ? 0.4 : 0.2}
                  strokeWidth={hoveredStore === store.name ? 3 : 2}
                  dot={{ 
                    r: hoveredStore === store.name ? 6 : 4, 
                    fill: colors[index % colors.length],
                    strokeWidth: 2,
                    stroke: '#fff'
                  }}
                  animationBegin={animationEnabled ? index * 300 : 0}
                  animationDuration={animationEnabled ? 1000 : 0}
                />
              )
            ))}
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '14px'
              }}
              onMouseEnter={handleLegendMouseEnter}
              onMouseLeave={handleLegendMouseLeave}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      {/* 信頼度情報とスコア詳細 */}
      {displayStores.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 信頼度情報 */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-semibold text-gray-700 mb-2">分析信頼度</div>
              <div className="space-y-1">
                {displayStores.map((store, index) => (
                  store.aiAnalysis && (
                    <div key={store.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="text-sm">{store.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        AI分析済み
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* 平均スコア */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-semibold text-gray-700 mb-2">平均スコア</div>
              <div className="space-y-1">
                {displayStores.map((store, index) => {
                  if (!store.aiAnalysis) return null
                  const features = store.aiAnalysis.features
                  const average = (features.taste + features.texture + features.size + features.priceValue + features.atmosphere) / 5
                  
                  return (
                    <div key={store.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="text-sm">{store.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {average.toFixed(1)}/10
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}