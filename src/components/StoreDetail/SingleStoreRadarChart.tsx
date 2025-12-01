'use client'

import { ResponsiveContainer, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts'
import { ExtendedStore, FeatureAnalysis } from '@/types/store'

interface SingleStoreRadarChartProps {
  store: ExtendedStore
}

interface ChartDataPoint {
  axis: string
  value: number
}

const chartLabels = [
  { key: 'taste', label: '味の濃さ' },
  { key: 'texture', label: '食感' },
  { key: 'size', label: 'ボリューム' },
  { key: 'priceValue', label: '価格満足度' },
  { key: 'atmosphere', label: '総合評価' }
] as const

interface TooltipPayload {
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
        <p className="text-primary dark:text-primary">
          {`スコア: ${payload[0].value}/10`}
        </p>
      </div>
    )
  }
  return null
}

export function SingleStoreRadarChart({ store }: SingleStoreRadarChartProps) {
  // AI分析データがない場合の処理
  if (!store.aiAnalysis) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
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

  // レーダーチャート用データの変換
  const chartData: ChartDataPoint[] = chartLabels.map(({ key, label }) => ({
    axis: label,
    value: store.aiAnalysis!.features[key as keyof FeatureAnalysis]
  }))

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
          豚饅の特徴チャート（AI分析）
        </h3>
      </div>
      
      <div className="w-full h-64" data-testid="single-store-radar-chart">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid className="stroke-gray-200 dark:stroke-gray-600" />
            <PolarAngleAxis 
              dataKey="axis" 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-gray-700 dark:text-gray-300"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fontSize: 10, fill: 'currentColor' }}
              className="text-gray-500 dark:text-gray-400"
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              dataKey="value"
              stroke="#F32D00"
              fill="#F32D00"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ r: 4, fill: '#F32D00' }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}