'use client'

import { SpectrumAxisConfig } from '@/types/spectrum'

export interface SpectrumBarProps {
  /** 評価軸の設定 */
  axis: SpectrumAxisConfig
  /** 現在の値 (1-10) */
  value: number
  /** 値変更コールバック（スライダーモードのみ） */
  onChange?: (value: number) => void
  /** 読み取り専用モード（店舗詳細用） */
  readonly?: boolean
}

/**
 * スペクトラムバーコンポーネント
 * 対比スタイルの評価軸を水平バーで視覚化
 */
export default function SpectrumBar({
  axis,
  value,
  onChange,
  readonly = false
}: SpectrumBarProps) {
  // インジケーターの位置を計算（0-100%）
  // value=1 → 0%, value=10 → 100%
  const indicatorPosition = ((value - 1) / 9) * 100

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(parseInt(e.target.value, 10))
    }
  }

  return (
    <div className="w-full py-2">
      {/* ラベル行 */}
      <div className="flex justify-between text-xs text-text-secondary dark:text-gray-400 mb-1">
        <span>{axis.leftLabel}</span>
        <span>{axis.rightLabel}</span>
      </div>

      {/* バー本体 */}
      <div className="relative h-3 flex items-center">
        {/* 背景バー - 読み取り専用：薄いグレー / 編集モード：黒 */}
        <div className={`absolute inset-x-0 h-2 rounded-full ${
          readonly
            ? 'bg-gray-300 dark:bg-gray-600'
            : 'bg-gray-900 dark:bg-gray-700'
        }`} />

        {/* 目盛り（編集モードのみ） */}
        {!readonly && (
          <div className="absolute inset-x-0 h-2 flex justify-between items-center px-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 h-1.5 bg-gray-500 rounded-full"
              />
            ))}
          </div>
        )}

        {/* インジケーター（読み取り専用モード）- 豚鼻デザイン、シャドウなし */}
        {readonly && (
          <div
            data-testid="spectrum-indicator"
            className="absolute w-7 h-5 bg-pig-pink rounded-full border-2 border-pig-pink-border pointer-events-none flex items-center justify-center gap-1"
            style={{ left: `${indicatorPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-1.5 h-2 bg-pig-pink-dark rounded-full" />
            <div className="w-1.5 h-2 bg-pig-pink-dark rounded-full" />
          </div>
        )}

        {/* スライダー（編集モード） */}
        {!readonly && onChange && (
          <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={handleSliderChange}
            aria-label={`${axis.leftLabel} から ${axis.rightLabel}`}
            className="absolute inset-x-0 h-3 opacity-0 cursor-pointer z-10"
          />
        )}

        {/* スライダーのカスタムサム（編集モード）- 豚鼻デザイン */}
        {!readonly && onChange && (
          <div
            data-testid="spectrum-indicator"
            className="absolute w-7 h-5 bg-pig-pink rounded-full border-2 border-pig-pink-border shadow-md pointer-events-none flex items-center justify-center gap-1"
            style={{ left: `${indicatorPosition}%`, transform: 'translateX(-50%)' }}
          >
            {/* 鼻の穴 */}
            <div className="w-1.5 h-2 bg-pig-pink-dark rounded-full" />
            <div className="w-1.5 h-2 bg-pig-pink-dark rounded-full" />
          </div>
        )}
      </div>
    </div>
  )
}
