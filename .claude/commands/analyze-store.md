---
description: 豚饅店舗の口コミを分析してstores.jsonに追加
allowed-tools: WebSearch, WebFetch, Read, Write, Edit
argument-hint: <店舗名>
---

# 豚饅店舗分析コマンド

店舗名: **$ARGUMENTS**

## タスク

指定された豚饅店舗について、ウェブから情報を収集・分析し、stores.jsonに追加するデータを生成してください。

## Step 1: 情報収集

以下の検索を実行して情報を収集:

1. WebSearchで「$ARGUMENTS 神戸 豚まん 口コミ」を検索
2. WebSearchで「$ARGUMENTS 食べログ」を検索
3. WebSearchで「$ARGUMENTS Google Maps 神戸」を検索

## Step 2: 詳細情報取得

検索結果から有用なページをWebFetchで取得し、以下の情報を抽出:

- 住所
- 営業時間
- 特徴・口コミ内容
- 価格帯
- 雰囲気の評判

## Step 3: データ生成

収集した情報から、以下のJSON形式でデータを生成:

```json
{
  "id": "(店舗名のローマ字・小文字・ハイフン区切り)",
  "name": "$ARGUMENTS",
  "address": "(収集した住所)",
  "coordinates": {
    "lat": (緯度 - 不明な場合は0),
    "lng": (経度 - 不明な場合は0)
  },
  "district": "(区名: 中央区/兵庫区/長田区など)",
  "businessHours": "(営業時間)",
  "features": ["特徴1", "特徴2", "特徴3", "特徴4"],
  "description": "(口コミを基にした100-150文字程度の説明文)",
  "googleMapsUrl": "https://maps.google.com/?q=(店舗名)+(住所)",
  "categories": ["テイクアウト" または "イートイン" または両方],
  "aiAnalysis": {
    "features": {
      "skinStyle": (1-10: 皮のスタイル),
      "fillingStyle": (1-10: 餡のスタイル),
      "overallTaste": (1-10: 全体の味わい),
      "size": (1-10: サイズ感)
    },
    "analysisDate": "(今日の日付 YYYY-MM-DD形式)"
  },
  "dataSource": {
    "collectionDate": "(今日の日付 YYYY-MM-DD形式)",
    "sourceUrl": "(主な情報源URL)",
    "isEnhanced": true
  }
}
```

### 評価基準（対比スタイル）

| 軸 | 1-3 | 4-6 | 7-10 |
|---|---|---|---|
| **skinStyle** | 薄皮・ふわふわ | 普通 | 厚皮・もちもち |
| **fillingStyle** | あっさり・野菜多め | バランス型 | こってり・肉感強め |
| **overallTaste** | 優しい味・上品 | 普通 | パンチのある味・濃いめ |
| **size** | 小ぶり・食べ歩き向き | 普通 | 大ぶり・満足感 |

※ 数値は良し悪しではなく、特徴の傾向を示す

## Step 4: 確認と保存

1. 生成したJSONデータを表示
2. ユーザーに内容確認を求める
3. 座標(coordinates)が不明な場合は、ユーザーに入力を促す
4. 確認が取れたら、`public/data/stores.json` を読み込み、`stores`配列に新しいデータを追加して保存

## 注意事項

- 情報が見つからない項目は推測せず、ユーザーに確認を求める
- 座標は正確な値が重要なので、不明な場合は必ず確認する
- 既存のstores.jsonのフォーマットと整合性を保つ
