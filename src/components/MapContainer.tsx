"use client";

import { useEffect, useRef, useState } from "react";
import { waitForGoogleMaps, isGoogleMapsAvailable } from "@/lib/google-maps";

interface MapContainerProps {
  className?: string;
}

/**
 * Google Maps コンテナコンポーネント
 * 神戸市中心の地図を表示する基本実装
 */
export default function MapContainer({ className = "" }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<unknown>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        // Google Maps APIが読み込まれるまで待機
        await waitForGoogleMaps();

        // コンポーネントがアンマウントされている場合は処理を中止
        if (!isMounted) return;

        if (!mapRef.current) {
          throw new Error("Map container element not found");
        }

        // 神戸市中心の座標
        const kobeCenter = {
          lat: 34.6937,
          lng: 135.5023,
        };

        // 地図の初期化
        googleMapRef.current = new window.google!.maps.Map(mapRef.current, {
          center: kobeCenter,
          zoom: 12,
          mapTypeId: "roadmap",
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
          console.log("Google Maps initialized successfully");
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
      // 地図インスタンスのクリーンアップ
      if (googleMapRef.current) {
        googleMapRef.current = null;
      }
    };
  }, []);

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
    <div
      ref={mapRef}
      className={`w-full h-full min-h-[400px] ${className}`}
      data-testid="map-container"
    >
      {!isMapInitialized && (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <div>Google Maps読み込み中...</div>
          </div>
        </div>
      )}
    </div>
  );
}
