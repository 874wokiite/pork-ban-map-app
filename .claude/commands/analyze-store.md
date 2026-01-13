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
      "taste": (1-10: 味の評価),
      "texture": (1-10: 皮・食感の評価),
      "size": (1-10: サイズ感、大きいほど高い),
      "priceValue": (1-10: コスパ),
      "atmosphere": (1-10: 店舗の雰囲気)
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

### 評価基準

- **taste**: 口コミで味への言及が肯定的なら7-10、普通なら5-6、否定的なら1-4
- **texture**: 皮のもちもち感、食感への評価
- **size**: 小ぶり=3-4、普通=5-6、大きい=7-8、特大=9-10
- **priceValue**: 値段に対する満足度、コスパの良さ
- **atmosphere**: 店舗の雰囲気、接客、清潔感

## Step 4: 確認と保存

1. 生成したJSONデータを表示
2. ユーザーに内容確認を求める
3. 座標(coordinates)が不明な場合は、ユーザーに入力を促す
4. 確認が取れたら、`public/data/stores.json` を読み込み、`stores`配列に新しいデータを追加して保存

## 注意事項

- 情報が見つからない項目は推測せず、ユーザーに確認を求める
- 座標は正確な値が重要なので、不明な場合は必ず確認する
- 既存のstores.jsonのフォーマットと整合性を保つ
