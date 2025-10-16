"use client";

import { useEffect, useRef, useState } from "react";
import { ExtendedStore } from "@/types/store";

interface StoreMarkerProps {
  store: ExtendedStore;
  map: google.maps.Map | unknown;
  onMarkerClick?: (store: ExtendedStore) => void;
}

/**
 * 神戸豚饅サミット店舗マーカーコンポーネント
 * Google Maps上に店舗位置を表示し、クリック時にイベントを発火
 * AdvancedMarkerElementを使用した最新の実装
 */
export default function StoreMarker({ store, map, onMarkerClick }: StoreMarkerProps) {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

  // マーカーライブラリの動的インポート
  useEffect(() => {
    const loadMarkerLibrary = async () => {
      if (!window.google?.maps) {
        return;
      }

      try {
        await window.google.maps.importLibrary("marker");
        setIsLibraryLoaded(true);
      } catch (error) {
        console.error('Failed to load marker library:', error);
      }
    };

    loadMarkerLibrary();
  }, []);

  useEffect(() => {
    // Google Maps API、map、ライブラリが利用可能かチェック
    if (!window.google?.maps || !map || !isLibraryLoaded) {
      return;
    }

    // カスタムマーカーアイコンを作成
    const iconElement = document.createElement('img');
    iconElement.src = '/icons/butaman-marker.svg';
    iconElement.style.width = '40px';
    iconElement.style.height = '40px';
    iconElement.alt = store.name;

    // AdvancedMarkerElementを作成
    markerRef.current = new google.maps.marker.AdvancedMarkerElement({
      position: store.coordinates,
      map: map as google.maps.Map,
      title: store.name,
      content: iconElement
    });

    // クリックイベントリスナーを追加
    const clickListener = markerRef.current?.addListener('click', () => {
      if (onMarkerClick) {
        onMarkerClick(store);
      }
    });

    // クリーンアップ関数
    return () => {
      if (markerRef.current) {
        // イベントリスナーを削除
        if (clickListener) {
          window.google.maps.event.removeListener(clickListener);
        }
        // マーカーを地図から削除
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [store, map, onMarkerClick, isLibraryLoaded]);

  // mapプロパティが変更された時の処理
  useEffect(() => {
    if (markerRef.current && map) {
      markerRef.current.map = map as google.maps.Map;
    }
  }, [map]);

  // 店舗データが変更された時の処理
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.position = store.coordinates;
    }
  }, [store.coordinates]);

  // このコンポーネントはDOMを直接レンダリングしない
  // マーカーはGoogle Maps APIによって地図上に描画される
  return null;
}