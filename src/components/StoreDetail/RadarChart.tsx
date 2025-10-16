'use client'

import { ResponsiveContainer, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts'
import { ExtendedStore, FeatureAnalysis } from '@/types/store'

interface RadarChartProps {
  stores: ExtendedStore[]
  mode: 'single' | 'comparison'
  selectedStoreIds: string[]
  onModeChange?: (mode: 'single' | 'comparison') => void
  onStoreSelect?: (storeId: string) => void
}

interface ChartDataPoint {
  axis: string
  [storeName: string]: string | number
}

const chartLabels = [
  { key: 'taste', label: '味の濃さ' },
  { key: 'texture', label: '食感' },
  { key: 'size', label: 'ボリューム' },
  { key: 'priceValue', label: '価格満足度' },
  { key: 'atmosphere', label: '総合評価' }
] as const

const colors = ['#8884d8', '#82ca9d', '#ffc658']

interface TooltipPayload {
  color: string
  dataKey: string
  value: number
}

interface TooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 dark:text-white">{`${label}`}</p>
        {payload.map((entry, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}/10`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function RadarChart({ stores, selectedStoreIds }: RadarChartProps) {
  const selectedStores = stores.filter(store => selectedStoreIds.includes(store.id))
  
  // 選択された店舗がない場合は空のチャートを表示
  if (selectedStoreIds.length === 0) {
    // 空のレーダーチャート用データ
    const emptyChartData = chartLabels.map(({ label }) => ({
      axis: label
    }))

    return (
      <div className="w-full space-y-4">
        {/* 表示制限の警告プレースホルダー（空なので何も表示しない） */}
        
        <div className="w-full h-96" data-testid="radar-chart">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={emptyChartData}>
              <PolarGrid className="stroke-gray-200 dark:stroke-gray-600" />
              <PolarAngleAxis 
                dataKey="axis" 
                tick={{ fontSize: 12, fill: '#374151' }}
                className="text-gray-700 dark:text-gray-300"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fontSize: 10, fill: '#6B7280' }}
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Radarコンポーネント（データ線）は追加しない */}
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>

      </div>
    )
  }
  
  // AI分析データがない場合の処理
  const hasAnalysisData = selectedStores.some(store => store.aiAnalysis)
  
  if (!hasAnalysisData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-lg mb-2">📊</div>
          <div>AI分析データがありません</div>
          <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
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
    <div className="w-full space-y-4">
      {/* 表示制限の警告 */}
      {selectedStores.length > 3 && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
          ⚠️ 比較表示は最大3店舗までです。最初の3店舗を表示しています。
        </div>
      )}
      
      <div className="w-full h-96" data-testid="radar-chart">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid className="stroke-gray-200 dark:stroke-gray-600" />
            <PolarAngleAxis 
              dataKey="axis" 
              tick={{ fontSize: 12, fill: '#374151' }}
              className="text-gray-700 dark:text-gray-300"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              className="dark:text-gray-400"
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            {displayStores.map((store, index) => (
              store.aiAnalysis && (
                <Radar
                  key={store.id}
                  name={store.name}
                  dataKey={store.name}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ r: 4, fill: colors[index % colors.length] }}
                />
              )
            ))}
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}