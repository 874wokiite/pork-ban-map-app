"use client";

import React, { useEffect } from "react";
import { ExtendedStore } from "@/types/store";
import { RadarChartComparison } from "./StoreDetail/RadarChartComparison";

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  allStores: ExtendedStore[];
  onStoreSelect?: (store: ExtendedStore) => void;
}

export default function AIAnalysisModal({
  isOpen,
  onClose,
  allStores,
  onStoreSelect,
}: AIAnalysisModalProps) {
  // Escキーでモーダルを閉じる
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // body要素のスクロールを制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // モーダルが開いていない場合は何も表示しない
  if (!isOpen) {
    return null;
  }

  // 背景クリック時のハンドラー
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      data-testid="ai-analysis-modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            店舗比較（AI分析）
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="閉じる"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          <RadarChartComparison stores={allStores} onStoreSelect={onStoreSelect} />
        </div>
      </div>
    </div>
  );
}
