/**
 * 住所から座標を取得してJSONファイルを更新するスクリプト
 * 開発時にのみ使用
 */

import fs from 'fs';
import path from 'path';

// 店舗データの型定義
interface StoreData {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  [key: string]: any;
}

interface StoresJson {
  stores: StoreData[];
}

/**
 * 指定された住所の座標をコンソールに出力する関数
 * 実際のジオコーディングはGoogle Maps APIが必要なので、
 * ここでは手動で確認できるようにログ出力
 */
function logAddressesForManualGeocoding() {
  const jsonPath = path.join(process.cwd(), 'public/data/stores.json');
  
  try {
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const storesData: StoresJson = JSON.parse(jsonData);
    
    console.log('=== 店舗住所一覧（Google Mapsで手動確認用） ===\n');
    
    storesData.stores.forEach((store, index) => {
      console.log(`${index + 1}. ${store.name}`);
      console.log(`   住所: ${store.address}`);
      console.log(`   現在の座標: lat: ${store.coordinates.lat}, lng: ${store.coordinates.lng}`);
      console.log(`   Google Maps URL: https://www.google.com/maps/search/${encodeURIComponent(store.address)}`);
      console.log('');
    });
    
    console.log('各URLをブラウザで開いて正確な座標を確認してください。');
    console.log('Google Mapsで右クリック → 座標をコピーして、stores.jsonを更新してください。');
    
  } catch (error) {
    console.error('JSONファイルの読み込みに失敗しました:', error);
  }
}

/**
 * 神戸市中央区の主要エリアの参考座標
 */
function logReferenceCoordinates() {
  console.log('\n=== 神戸市中央区 参考座標 ===\n');
  console.log('元町駅周辺: lat: 34.6918, lng: 135.1955');
  console.log('三宮駅周辺: lat: 34.6937, lng: 135.5023');
  console.log('栄町通: lat: 34.6904, lng: 135.1925');
  console.log('下山手通: lat: 34.6875, lng: 135.1880');
  console.log('旗塚通: lat: 34.6845, lng: 135.1835');
  console.log('八雲通: lat: 34.6855, lng: 135.1825');
  console.log('');
}

// スクリプト実行
if (require.main === module) {
  logReferenceCoordinates();
  logAddressesForManualGeocoding();
}