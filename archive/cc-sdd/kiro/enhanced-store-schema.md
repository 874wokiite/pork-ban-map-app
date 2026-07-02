# 拡張Store データスキーマ設計

## 概要
神戸豚饅マップアプリケーションにおける拡張Store型の設計と移行戦略。
AI分析結果とデータ収集メタデータを含む拡張データ構造を定義する。

## 拡張データ構造

### ExtendedStore インターフェース
```typescript
interface ExtendedStore extends Store {
  // AI分析結果フィールド（オプション）
  aiAnalysis?: {
    features: {
      taste: number;        // 味の濃さ (0-10)
      texture: number;      // 食感 (0-10)
      size: number;         // ボリューム (0-10)
      priceValue: number;   // 価格満足度 (0-10)
      atmosphere: number;   // 総合評価 (0-10)
    };
    confidence: number;     // 信頼度スコア (0-100%)
    reviewCount: number;    // 分析対象口コミ数
    analysisDate: string;   // 分析実行日時
  };
  
  // データ収集メタデータ
  dataSource: {
    collectionDate: string;  // データ収集日時
    sourceUrl: string;       // 収集元URL
    isEnhanced: boolean;     // AI分析実施フラグ
  };
}
```

## 後方互換性戦略

### Store型の完全保持
- 既存のStore型定義は一切変更しない
- ExtendedStoreは純粋な拡張として実装
- 既存コンポーネントは変更なしで動作継続

### オプショナルフィールド設計
- `aiAnalysis`: オプショナル（未実装店舗でも動作）
- `dataSource`: 必須（すべての店舗にメタデータ付与）

### データファイルマイグレーション
```json
{
  "stores": [
    {
      // 既存フィールドは全て保持
      "id": "roushouki",
      "name": "老祥記",
      // ... 全ての既存フィールド ...
      
      // 新規フィールド
      "aiAnalysis": {
        "features": {
          "taste": 9,
          "texture": 8,
          "size": 7,
          "priceValue": 9,
          "atmosphere": 8
        },
        "confidence": 85,
        "reviewCount": 150,
        "analysisDate": "2025-10-15T12:00:00Z"
      },
      "dataSource": {
        "collectionDate": "2025-10-15T10:00:00Z",
        "sourceUrl": "https://www.kobebutaman-summit.com/shop/roushouki",
        "isEnhanced": true
      }
    }
  ]
}
```

## スキーマバリデーション

### 必須バリデーション
1. 既存Store型の全フィールド検証
2. aiAnalysis.features の各値が0-10範囲内
3. aiAnalysis.confidence が0-100範囲内
4. dataSource.collectionDate の有効なISO8601形式
5. dataSource.sourceUrl の有効なURL形式

### エラーハンドリング
- スキーマ不適合時は警告とフォールバック処理
- AI分析データ欠損時はデフォルト表示
- メタデータ不正時は基本情報のみ表示

## 実装フェーズ

### Phase 1: 型定義拡張
- ExtendedStore型の定義
- バリデーション関数の実装
- 型エクスポートの追加

### Phase 2: データ収集・生成
- 神戸豚饅サミット公式サイトからの情報収集
- AI分析による特徴データ生成
- 拡張JSONファイルの構築

### Phase 3: 統合・置き換え
- 既存stores.jsonを拡張データで完全置き換え
- 既存コンポーネントとの互換性確認
- 新機能（レーダーチャート）の追加

## データ品質保証

### 完全性チェック
- 全店舗の必須フィールド存在確認
- 座標データの妥当性検証
- 価格・営業時間の整合性確認

### 一貫性チェック
- ID重複なし
- 同一形式の住所・営業時間表記
- カテゴリ値の統一性

### 精度チェック
- AI分析の信頼度スコア閾値（最低60%）
- 口コミ分析の対象数（最低20件）
- データ収集日の新鮮性（1ヶ月以内）