'use client'

import { ExtendedStore } from '@/types/store'
import { SPECTRUM_AXES, isSpectrumFeatureAnalysis } from '@/types/spectrum'
import SpectrumBar from '@/components/SpectrumBar'

interface StoreSpectrumSectionProps {
  store: ExtendedStore
}

/**
 * 店舗詳細用スペクトラムバーセクション
 * 4軸評価をスペクトラムバーで視覚化
 */
export default function StoreSpectrumSection({ store }: StoreSpectrumSectionProps) {
  // aiAnalysisがない場合、またはSpectrumFeatureAnalysis形式でない場合は表示しない
  if (!store.aiAnalysis || !isSpectrumFeatureAnalysis(store.aiAnalysis.features)) {
    return null
  }

  const features = store.aiAnalysis.features

  return (
    <div data-testid="spectrum-section">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
        豚饅の特徴
      </h3>
      <div className="space-y-1">
        {SPECTRUM_AXES.map((axis) => (
          <SpectrumBar
            key={axis.key}
            axis={axis}
            value={features[axis.key]}
            readonly
          />
        ))}
      </div>
    </div>
  )
}
