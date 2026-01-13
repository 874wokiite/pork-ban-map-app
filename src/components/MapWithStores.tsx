"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import MapContainer from "@/components/MapContainer";
import StoreMarker from "@/components/StoreMarker";
import FilterButton from "@/components/FilterButton";
import FilterMatchingModal from "@/components/FilterMatchingModal";
import { getExtendedStoresData } from "@/lib/store-data";
import { ExtendedStore } from "@/types/store";

interface MapWithStoresProps {
  className?: string;
  onStoreClick?: (store: ExtendedStore) => void;
  onSearchClick?: () => void;
}

/**
 * 店舗マーカー付き地図コンポーネント
 * MapContainerと店舗データを組み合わせて、店舗位置を表示
 */
export default function MapWithStores({ className, onStoreClick, onSearchClick }: MapWithStoresProps) {
  const [stores, setStores] = useState<ExtendedStore[]>([]);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isStoresLoaded, setIsStoresLoaded] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // 店舗データを読み込み
  useEffect(() => {
    const loadStores = async () => {
      try {
        const storeData = await getExtendedStoresData();
        setStores(storeData);
        setIsStoresLoaded(true);
      } catch (error) {
        console.error("店舗データの読み込みに失敗しました:", error);
        setIsStoresLoaded(true); // エラーでも読み込み完了とする
      }
    };

    loadStores();
  }, []);

  // MapContainerからmapインスタンスを受け取るコールバック（useCallbackで最適化）
  const handleMapReady = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  // マーカークリック時のハンドラ（useCallbackで最適化）
  const handleMarkerClick = useCallback((store: ExtendedStore) => {
    console.log("店舗マーカークリック:", store.name);
    if (onStoreClick) {
      onStoreClick(store);
    }
  }, [onStoreClick]);

  // フィルターボタンクリック時のハンドラ
  const handleFilterClick = useCallback(() => {
    setIsFilterModalOpen(true);
  }, []);

  // フィルターモーダル閉じるハンドラ
  const handleFilterClose = useCallback(() => {
    setIsFilterModalOpen(false);
  }, []);

  // フィルターモーダルから店舗選択時のハンドラ
  const handleFilterStoreSelect = useCallback((store: ExtendedStore) => {
    setIsFilterModalOpen(false);
    if (onStoreClick) {
      onStoreClick(store);
    }
  }, [onStoreClick]);

  return (
    <div className={`relative ${className || ''}`}>
      {/* ベースとなる地図コンポーネント */}
      <MapContainer 
        className="w-full h-full"
        onMapReady={handleMapReady}
      />
      
      {/* 検索ボタン */}
      {onSearchClick && (
        <button
          onClick={onSearchClick}
          className="absolute top-4 right-4 z-10 bg-accent-green hover:bg-accent-green/90 text-white shadow-xl hover:shadow-2xl rounded-full p-4 transition-all duration-300 transform hover:scale-110"
          aria-label="AI分析・比較を開く"
          title="AI分析・比較"
        >
          <Image
            src="/icons/ban-logo.svg"
            alt="豚饅ロゴ"
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </button>
      )}

      {/* フィルターボタン */}
      <div className="absolute top-4 left-4 z-10">
        <FilterButton onClick={handleFilterClick} />
      </div>

      {/* フィルターモーダル */}
      <FilterMatchingModal
        isOpen={isFilterModalOpen}
        onClose={handleFilterClose}
        stores={stores}
        onStoreSelect={handleFilterStoreSelect}
      />
      
      {/* 店舗マーカーを地図上に配置 */}
      {mapInstance && isStoresLoaded && stores.map((store) => (
        <StoreMarker
          key={store.id}
          store={store}
          map={mapInstance}
          onMarkerClick={handleMarkerClick}
        />
      ))}
    </div>
  );
}