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
      aria-label="好みで探す"
      className="flex items-center gap-2 px-4 py-2 bg-white shadow-lg rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <svg
        className="w-5 h-5 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
      <span className="text-sm font-medium text-gray-700">好みで探す</span>
    </button>
  )
}
