# Design Document - 神戸豚饅マップアプリケーション

## 設計概要

神戸豚饅サミット参加店舗を可視化するWebアプリケーションの技術設計文書。Next.js App Routerアーキテクチャを基盤とし、インタラクティブマップと店舗詳細表示機能を提供する。

## アーキテクチャ設計

### システムアーキテクチャ
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Data Layer    │    │   External APIs │
│   (Next.js)     │    │   (Static JSON) │    │   (Map Service) │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Map Component │ ←→ │ • Store Data    │ ←→ │ • Google Maps   │
│ • Store Details │    │ • Coordinates   │    │ • Geocoding     │
│ • Responsive UI │    │ • Store Info    │    │ • Street View   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技術スタック詳細
- **フロントエンド**: Next.js 15.5.5 + React 19.1.0 + TypeScript
- **地図サービス**: Google Maps JavaScript API
- **スタイリング**: Tailwind CSS 4 + CSS Custom Properties
- **状態管理**: React Built-in State (useState, useContext)
- **データ管理**: 静的JSONファイル（将来的にCMS連携）

## コンポーネント設計

### ページ構造
```
src/app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Main map page
├── globals.css                   # Global styles
└── components/
    ├── MapContainer.tsx          # Map wrapper component
    ├── StoreMarker.tsx          # Individual store marker
    ├── StoreDetail/
    │   ├── StoreModal.tsx       # Store detail modal
    │   ├── StoreInfo.tsx        # Store information display
    │   └── StoreImage.tsx       # Store image gallery
    ├── ui/
    │   ├── Button.tsx           # Reusable button component
    │   ├── Card.tsx             # Card component
    │   └── LoadingSpinner.tsx   # Loading indicator
    └── common/
        ├── Header.tsx           # App header
        └── ErrorBoundary.tsx    # Error handling
```

### データ型定義
```typescript
// types/store.ts
interface Store {
  id: string
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  district: string
  businessHours: string
  price: number
  features: string[]
  description?: string
  images: string[]
  phone?: string
  website?: string
  googleMapsUrl: string
  categories: ('テイクアウト' | '店内飲食' | '通販')[]
}

interface MapState {
  stores: Store[]
  selectedStore: Store | null
  mapCenter: { lat: number, lng: number }
  mapZoom: number
  isLoading: boolean
}
```

## UI/UX設計

### レスポンシブブレークポイント
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Mobile landscape / Small tablet */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### デザインシステム
```css
/* Color palette */
:root {
  --primary: #8B4513;        /* 豚饅ブラウン */
  --primary-light: #CD853F;   /* ライトブラウン */
  --secondary: #FF6B35;       /* アクセントオレンジ */
  --background: #FFFFFF;      /* 背景白 */
  --surface: #F8F9FA;        /* サーフェス */
  --text-primary: #2D3748;   /* プライマリテキスト */
  --text-secondary: #718096; /* セカンダリテキスト */
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #1A202C;
    --surface: #2D3748;
    --text-primary: #F7FAFC;
    --text-secondary: #E2E8F0;
  }
}
```

### マップ設計
```typescript
// Map configuration
const MAP_CONFIG = {
  center: { lat: 34.6937, lng: 135.5023 }, // 神戸市中心
  zoom: 12,
  styles: [
    // Custom map styling for better contrast
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
}

// Marker design
const MARKER_CONFIG = {
  icon: {
    url: '/icons/butaman-marker.svg',
    scaledSize: { width: 40, height: 40 },
    anchor: { x: 20, y: 40 }
  },
  cluster: {
    gridSize: 50,
    maxZoom: 15
  }
}
```

## インタラクション設計

### ユーザーフロー
1. **初期表示**: 神戸市全域の地図 + 全店舗マーカー表示
2. **店舗選択**: マーカークリック → 店舗詳細モーダル表示
3. **地図操作**: ズーム、パン、現在地表示
4. **外部連携**: Googleマップで開く、電話発信

### 状態管理設計
```typescript
// Context for global state
const MapContext = createContext<{
  state: MapState
  actions: {
    selectStore: (store: Store | null) => void
    setMapCenter: (center: { lat: number, lng: number }) => void
    setMapZoom: (zoom: number) => void
    setLoading: (loading: boolean) => void
  }
}>()

// Custom hooks
const useMapState = () => useContext(MapContext)
const useStoreData = () => // Custom hook for store data fetching
const useGeolocation = () => // Custom hook for user location
```

## データ設計

### 店舗データ構造
```json
{
  "stores": [
    {
      "id": "roushouki",
      "name": "老祥記",
      "address": "〒650-0022 兵庫県神戸市中央区元町通2-1-14",
      "coordinates": { "lat": 34.6918, "lng": 135.1955 },
      "district": "中央区",
      "businessHours": "月〜土 8:30-18:30 (定休日: 日曜)",
      "price": 100,
      "features": ["伝統の味", "行列必至", "豚饅発祥"],
      "description": "豚饅の元祖として知られる老舗",
      "images": [
        "/images/stores/roushouki/exterior.jpg",
        "/images/stores/roushouki/butaman.jpg"
      ],
      "phone": "078-331-7714",
      "googleMapsUrl": "https://maps.google.com/?q=老祥記+神戸",
      "categories": ["テイクアウト"]
    }
  ]
}
```

### ファイル構成
```
public/
├── data/
│   ├── stores.json              # 店舗マスターデータ
│   └── districts.json           # 区分マスターデータ
├── images/
│   └── stores/
│       ├── roushouki/          # 店舗別画像フォルダ
│       ├── shikourou/
│       └── ...
└── icons/
    ├── butaman-marker.svg      # カスタムマーカー
    └── location-pin.svg        # 現在地ピン
```

## パフォーマンス設計

### 最適化戦略
1. **画像最適化**: Next.js Image component + WebP format
2. **マーカークラスタリング**: 多数店舗の表示最適化
3. **遅延読み込み**: 店舗詳細の段階的読み込み
4. **キャッシング**: Static Generation + ISR for store data

### コード分割
```typescript
// Dynamic imports for performance
const StoreModal = dynamic(() => import('@/components/StoreDetail/StoreModal'), {
  loading: () => <LoadingSpinner />
})

const MapContainer = dynamic(() => import('@/components/MapContainer'), {
  ssr: false // クライアントサイドでのみ読み込み
})
```

## セキュリティ設計

### API Key管理
```typescript
// Environment variables
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
GOOGLE_MAPS_API_KEY_SERVER=your_server_key_here

// API Key restrictions
- HTTP referrers: your-domain.com/*
- APIs: Maps JavaScript API, Geocoding API
```

### データ保護
- 個人情報は含まない公開店舗情報のみ
- HTTPS通信の強制
- CSP (Content Security Policy) の設定

## 展開設計

### ビルド構成
```typescript
// next.config.ts
const nextConfig = {
  output: 'export',  // 静的サイト生成
  trailingSlash: true,
  images: {
    unoptimized: true,  // Netlify向け設定
    domains: ['maps.googleapis.com'],
    formats: ['image/webp', 'image/avif']
  },
  env: {
    GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  }
}
```

### Netlify設定
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### デプロイメント戦略
- **Static Export**: 静的サイト生成でNetlifyにデプロイ
- **環境**: mainブランチのみ (development → production)
- **デプロイ**: Netlifyの自動デプロイ機能を使用

## 監視・分析設計

### パフォーマンス監視
- Core Web Vitals tracking
- Google Analytics integration
- Error tracking (Sentry)

### ユーザー行動分析
- マップ操作イベント追跡
- 店舗詳細表示頻度
- 外部リンククリック率