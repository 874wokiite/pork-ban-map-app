"use client";

import { useEffect, useRef } from "react";
import { Store } from "@/types/store";

interface StoreMarkerProps {
  store: Store;
  map: google.maps.Map | unknown;
  onMarkerClick?: (store: Store) => void;
}

/**
 * 神戸豚饅サミット店舗マーカーコンポーネント
 * Google Maps上に店舗位置を表示し、クリック時にイベントを発火
 */
export default function StoreMarker({ store, map, onMarkerClick }: StoreMarkerProps) {
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    // Google Maps APIとmapが利用可能かチェック
    if (!window.google?.maps || !map) {
      return;
    }

    // カスタムマーカーアイコンの設定
    const markerIcon: google.maps.Icon = {
      url: '/icons/butaman-marker.svg',
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 40)
    };

    // マーカーを作成
    markerRef.current = new window.google.maps.Marker({
      position: store.coordinates,
      map: map as google.maps.Map,
      title: store.name,
      icon: markerIcon
    });

    // クリックイベントリスナーを追加
    markerRef.current.addListener('click', () => {
      if (onMarkerClick) {
        onMarkerClick(store);
      }
    });

    // クリーンアップ関数
    return () => {
      if (markerRef.current) {
        // イベントリスナーを削除
        if (window.google?.maps?.event?.clearInstanceListeners) {
          window.google.maps.event.clearInstanceListeners(markerRef.current);
        }
        // マーカーを地図から削除
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [store, map, onMarkerClick]);

  // mapプロパティが変更された時の処理
  useEffect(() => {
    if (markerRef.current && map) {
      markerRef.current.setMap(map as google.maps.Map);
    }
  }, [map]);

  // 店舗データが変更された時の処理
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setPosition(store.coordinates);
    }
  }, [store.coordinates]);

  // このコンポーネントはDOMを直接レンダリングしない
  // マーカーはGoogle Maps APIによって地図上に描画される
  return null;
}