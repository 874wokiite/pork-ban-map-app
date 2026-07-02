# CLAUDE.md

このファイルは Claude Code がこのリポジトリで作業する際のガイドです。

## プロジェクト概要

**豚饅マップ KOBE** — 神戸豚饅サミット参加店舗を Google Maps 上で探索できる Web アプリ。
Next.js の静的エクスポート（`out/`）を Netlify にデプロイする構成で、サーバーサイド処理はない。

## コマンド

```bash
npm run dev        # 開発サーバー（Turbopack）
npm run build      # 静的ビルド（out/ に出力）
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Jest全実行
npx jest __tests__/stores-data.test.ts   # 単一ファイル実行
```

CI（`.github/workflows/ci.yml`）で lint → typecheck → test → build が push/PR 時に実行される。
ローカルでも push 前にこの4つを通すこと。

## アーキテクチャ

- `public/data/stores.json` — **このアプリの中核データ**。店舗情報・AI分析値・収集メタデータを持つ。クライアントから fetch で読み込む（`src/lib/store-data.ts`）。
- `src/types/store.ts` — `Store` / `ExtendedStore`（`dataSource` 必須、`aiAnalysis` オプション）。
- `src/types/spectrum.ts` — 4軸評価 `SpectrumFeatureAnalysis`（skinStyle / fillingStyle / overallTaste / size、各1〜10）。
- `src/lib/stores-schema.ts` — stores.json の zod スキーマ。`__tests__/stores-schema.test.ts` で全データを検証。
- マーカーは `google.maps.marker.AdvancedMarkerElement` を使用（旧 `google.maps.Marker` は現在地表示のみ）。
- マッチングフィルター: `src/hooks/useMatchingFilter.ts` + `src/lib/matching-calculator.ts`。

## データ運用ルール（stores.json）

- `categories` は `テイクアウト` / `店内飲食` / `通販` のみ（「イートイン」は不可。型は `StoreCategory`）。
- 座標は兵庫県南部の範囲内（lat 34.5〜35.0 / lng 134.5〜135.6）。範囲を広げる場合はスキーマと `stores-data.test.ts` の両方を更新。
- 店舗追加は `/analyze-store` スキルを使用。追加後は必ず `npm test` でスキーマ検証を通す。
- 調査過程のメタデータ（収集元URL、収集日、AI分析実施フラグ）も `dataSource` に構造化して残す方針。

## 注意点

- 設定ファイル自体にもテストがある: `netlify.toml` を変更したら `__tests__/netlify-config.test.ts`、`next.config.ts` なら `__tests__/next-config.test.ts` も更新すること。
- 環境変数は `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` のみ（`.env.example` 参照、`.env.local` に設定）。
- UI実装時は `/ui-implementation` スキル（既存カラーシステム準拠）、リリース時は `/release-notes` スキルを使う。
