<p align="center">
  <img src="public/images/header.png" alt="豚饅マップ KOBE" width="600">
</p>

<h1 align="center">豚饅マップ KOBE</h1>

<p align="center">
  <strong>神戸の豚饅（ぶたまん）店舗を探索できるインタラクティブマップアプリ</strong>
</p>

<p align="center">
  <a href="#features">機能</a> •
  <a href="#demo">デモ</a> •
  <a href="#tech-stack">技術スタック</a> •
  <a href="#getting-started">はじめ方</a> •
  <a href="#release-notes">リリースノート</a>
</p>

---

## 概要

**豚饅マップ KOBE** は、神戸豚饅サミット参加店舗を地図上で探索できるWebアプリケーションです。1915年創業の老祥記をはじめとする神戸の伝統的な豚饅店舗を、インタラクティブなマップと詳細な店舗情報で紹介します。

<p align="center">
  <img src="public/images/opengraph-image.png" alt="豚饅マップ キャラクター" width="500">
</p>

## Features

### 店舗マップ
- Google Maps連携による店舗位置表示
- かわいい豚饅カスタムマーカー
- 現在地からのナビゲーション対応

### 店舗詳細
- 営業時間・定休日
- 特徴・こだわりポイント
- サービス形態（テイクアウト/店内飲食/通販）

### AI分析チャート
- 皮のスタイル（もちもち〜ふわふわ）
- 餡のスタイル（あっさり〜こってり）
- 味の傾向（伝統的〜モダン）
- サイズ感

### デザイン
- レスポンシブデザイン（モバイルファースト）
- ダークモード対応
- かわいいオリジナルイラスト

## 登録店舗（14店舗）

<details>
<summary>詳細を見る</summary>

| 店舗名 | エリア | 特徴 |
|--------|--------|------|
| 老祥記 | 中央区 | 豚饅の元祖、1915年創業 |
| 四興樓 | 中央区 | 大ぶりでふっくら甘い皮 |
| 三宮一貫楼 | 中央区 | 玉ねぎの甘みが特徴 |
| 曹家包子館 | 中央区 | 椎茸豚肉包専門店 |
| 太平閣 | 中央区 | 70年の伝統、大サイズ |
| 皇蘭 | 中央区 | 神戸牛まんで人気 |
| 朋榮 | 中央区 | 焼き豚まん・フカヒレ豚まん |
| 杏杏 | 中央区 | 伝統中華粥店 |
| 点心Tsubakien | 中央区 | 本格点心、モダン中華 |
| 新安源商店 | 中央区 | Coming Soon... |
| 天一製菓 | 灘区 | 台湾仕込み、天然酵母皮 |
| ぶたまんや | 中央区 | 手作り豚まん専門店 |
| 大石一貫楼 | 東灘区 | 一貫楼の暖簾分け |
| 垂水飯店 六甲道店 | 灘区 | 地元密着の中華料理店 |

</details>

## Tech Stack

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript |
| UI | React 19 |
| スタイリング | Tailwind CSS 4 |
| 地図 | Google Maps JavaScript API |
| チャート | Recharts |
| テスト | Jest + Testing Library |

## Getting Started

### 必要要件

- Node.js 18+
- npm
- Google Maps API キー

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/pork-ban-map-app.git
cd pork-ban-map-app

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local に NEXT_PUBLIC_GOOGLE_MAPS_API_KEY を設定

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

### ビルド

```bash
npm run build
npm start
```

## Release Notes

<details>
<summary>詳細を見る</summary>

### v1.2.0 - 2026-01-13 (Latest)

**新機能**
- **Spectrum分析表示**: 店舗の特徴を直感的に把握できる横棒グラフ形式のUI導入
- **フィルターマッチング機能**: 好みの条件で店舗を絞り込み、マッチ度表示
- **新規3店舗追加**: ぶたまんや、大石一貫楼、垂水飯店 六甲道店

**改善**
- StoreModalのレイアウト・スタイリング改善
- RadarChart形式からSpectrum形式へ刷新（よりシンプルで見やすいデザイン）
- テストカバレッジ拡充（SpectrumBar、FilterMatchingModal、useMatchingFilter）

---

### v1.1.0 - 2025-12-02 (正式版リリース)

**デザイン刷新**
- オリジナルキャラクターイラストを追加
- ヘッダーデザインを一新（マーキーアニメーション実装）
- モーダルUIを改善（背景ブラー効果）
- ゼン丸ゴシックフォントを採用

**機能改善**
- ダークモード対応を強化
- Open Graph / Twitterカード対応（SNSシェア最適化）
- 各種アイコン・スタイルの更新

---

### v1.0.0-beta - 2025-10-14〜16 (β版リリース)

**初期リリース**
- Google Mapsによるインタラクティブマップ実装
- 店舗マーカー表示（カスタム豚饅アイコン）
- 店舗詳細モーダル
- AI分析レーダーチャート（Recharts）
- 基本的な店舗データ構造の確立
- レスポンシブデザイン対応

**登録店舗（初期）**
- 老祥記、四興樓、三宮一貫楼など中央区の主要店舗

</details>

## 貢献

Issue や Pull Request は歓迎します！

---

<p align="center">
  Made with Kanon Fujita(874wokiite) in Kobe
</p>
