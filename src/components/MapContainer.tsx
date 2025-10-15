"use client";

import { useEffect, useRef, useState } from "react";
import { waitForGoogleMaps, isGoogleMapsAvailable } from "@/lib/google-maps";

interface MapContainerProps {
  className?: string;
  onMapReady?: (map: google.maps.Map) => void;
}

/**
 * Google Maps コンテナコンポーネント
 * 神戸市中心の地図を表示する基本実装
 * ReactとGoogle MapsのDOM操作競合を回避する安全な実装
 */
export default function MapContainer({ className = "", onMapReady }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<unknown>(null);
  const initializationRef = useRef(false);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      // 重複初期化防止
      if (initializationRef.current) return;
      initializationRef.current = true;

      try {
        // Google Maps APIが読み込まれるまで待機
        await waitForGoogleMaps();

        // コンポーネントがアンマウントされている場合は処理を中止
        if (!isMounted || !mapRef.current) {
          return;
        }

        // 神戸市中心の座標（豚饅店舗が集中する元町・三宮エリア）
        const kobeCenter = {
          lat: 34.6925,
          lng: 135.1955,
        };

        // 地図の初期化 - Reactが管理するDOM要素に直接アタッチ
        googleMapRef.current = new window.google!.maps.Map(mapRef.current, {
          center: kobeCenter,
          zoom: 13,
          mapTypeId: "roadmap",
          mapTypeControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          zoomControl: false,
          keyboardShortcuts: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        if (isMounted) {
          setIsMapInitialized(true);
        }
      } catch (error) {
        if (isMounted) {
          console.error("地図の初期化に失敗しました:", error);
          setError(error instanceof Error ? error.message : "地図の初期化に失敗しました");
        }
      }
    };

    // Google Maps APIが既に利用可能かチェック
    if (isGoogleMapsAvailable()) {
      initializeMap();
    } else {
      // API読み込み待機
      initializeMap();
    }

    // クリーンアップ関数
    return () => {
      isMounted = false;
      
      // Google Mapsインスタンスのクリーンアップ
      if (googleMapRef.current) {
        try {
          // Google Maps インスタンスをnullに設定
          // DOM操作は行わず、Reactに任せる
          googleMapRef.current = null;
        } catch (cleanupError) {
          console.warn("Map cleanup warning:", cleanupError);
        }
      }
      
      // 初期化フラグをリセット
      initializationRef.current = false;
    };
  }, []); // 初期化は一度だけ実行

  // onMapReadyコールバック呼び出し用のuseEffect
  useEffect(() => {
    if (isMapInitialized && onMapReady && googleMapRef.current) {
      onMapReady(googleMapRef.current as google.maps.Map);
    }
  }, [isMapInitialized, onMapReady]);

  if (error) {
    return (
      <div
        className={`w-full h-full min-h-[400px] flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`}
        data-testid="map-error"
      >
        <div className="text-center text-red-600">
          <div className="text-lg font-semibold mb-2">地図の読み込みエラー</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full min-h-[400px] relative ${className}`}>
      {/* Google Mapsが直接アタッチされるDOM要素 */}
      <div
        ref={mapRef}
        className="w-full h-full min-h-[400px]"
        data-testid="map-container"
        style={{
          // Google Maps用のスタイル設定
          position: 'relative',
          overflow: 'hidden',
        }}
      />
      
      {/* ローディングオーバーレイ */}
      {!isMapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <div className="text-gray-500">Google Maps読み込み中...</div>
          </div>
        </div>
      )}
    </div>
  );
}
