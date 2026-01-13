'use client'

export interface FilterButtonProps {
  onClick: () => void
}

/**
 * フィルター機能へのアクセスボタン
 * マップ画面上に配置してフィルターモーダルを開く
 */
export default function FilterButton({ onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="好みで探そう"
      className="flex items-center gap-2 px-4 py-2 bg-accent-green shadow-lg rounded-full border-2 border-gray-900 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
    >
      <img src="/icons/ban-logo.svg" alt="" className="w-5 h-5" />
      <span className="text-sm font-bold text-gray-900">好みで探そう</span>
    </button>
  )
}
