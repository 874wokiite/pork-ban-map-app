---
name: ui-implementation
description: UIコンポーネントを実装する際に使用。「UIを作って」「コンポーネントを実装して」「画面を作って」「ボタンを追加して」「モーダルを作って」などUI実装に関するリクエスト時に、既存のカラーシステムとスタイルガイドラインに従って実装する。
allowed-tools: Read, Write, Edit, Glob, Grep
---

# UI実装 Skill

## 目的

UI実装時に既存のカラーシステムとスタイルの考え方を統一する。

## カラーシステム

`src/app/globals.css` で定義されたカラーパレットを使用すること。

### ブランドカラー

| 変数名 | 値 | 用途 |
|--------|-----|------|
| `--primary` | #F32D00 | 中華赤 - 重要な要素、警告、強調 |
| `--primary-light` | #FEC611 | 中華橙 - アクセント、ハイライト |
| `--secondary` | #7c3aed | 神戸紫 - タグ、バッジ |
| `--accent-green` | #3AAF05 | 神戸緑 - **メインアクション**、ボタン、リンク、成功 |
| `--pig-pink` | #f9a8d4 | 豚鼻ピンク - スライダーつまみ背景 |
| `--pig-pink-border` | #f472b6 | 豚鼻ボーダー - スライダーつまみ枠線 |
| `--pig-pink-dark` | #ec4899 | 豚鼻穴 - スライダーつまみ内装飾 |

### UIカラー

| 変数名 | ライトモード | ダークモード | 用途 |
|--------|-------------|-------------|------|
| `--background` | #ffffff | #1A202C | 背景 |
| `--foreground` | #171717 | #F7FAFC | 文字 |
| `--surface` | #F8F9FA | #2D3748 | カード/セクション背景 |
| `--text-primary` | #070001 | #F7FAFC | メインテキスト |
| `--text-secondary` | #718096 | #E2E8F0 | サブテキスト、ラベル |
| `--border` | #E2E8F0 | #4A5568 | ボーダー |
| `--card` | #ffffff | #2D3748 | カード背景 |

### Tailwindでの使用方法

```tsx
// カスタムカラー
className="bg-primary text-white"
className="bg-secondary/20 text-secondary"
className="bg-accent-green hover:bg-accent-green/80"
className="text-text-primary"
className="border-border"
className="bg-surface"

// 豚鼻ピンク（スライダーなど）
className="bg-pig-pink border-pig-pink-border"
className="bg-pig-pink-dark"

// ダークモード対応
className="bg-white dark:bg-gray-800"
className="text-gray-900 dark:text-white"
className="text-gray-600 dark:text-gray-400"
className="border-gray-200 dark:border-gray-700"
```

## フォントシステム

| 変数名 | フォント | 用途 |
|--------|---------|------|
| `--font-sans` | Geist Sans | 英語テキスト |
| `--font-mono` | Geist Mono | コード |
| `--font-japanese` | Noto Serif JP | 日本語（明朝体） |
| `--font-zen` | Zen Old Mincho | 日本語（伝統的） |
| `--font-maru` | Zen Maru Gothic | 日本語（かわいい・メイン） |

### 使用方法

```tsx
// スタイル属性で指定
style={{ fontFamily: 'var(--font-zen-maru-gothic)' }}

// モーダルやカードのデフォルトフォント
<div style={{ fontFamily: 'var(--font-zen-maru-gothic)' }}>
```

## コンポーネントパターン

### モーダル

```tsx
// 背景オーバーレイ
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
  // モーダル本体
  <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
       style={{ fontFamily: 'var(--font-zen-maru-gothic)' }}>
    // ヘッダー
    <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">タイトル</h2>
      // 閉じるボタン
    </div>
    // コンテンツ
    <div className="p-6">
      <div className="space-y-6">
        // ...
      </div>
    </div>
  </div>
</div>
```

### セクションヘッダー

```tsx
<h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
  セクション名
</h3>
```

### タグ/バッジ

```tsx
<span className="inline-block bg-secondary/20 text-secondary dark:bg-secondary dark:text-white px-3 py-1 rounded-full text-sm font-medium">
  タグ名
</span>
```

### ボタン

```tsx
// プライマリボタン（緑）
<button className="inline-flex items-center px-4 py-2 bg-accent-green text-white rounded-md hover:bg-accent-green/80 transition-colors">
  ボタン
</button>

// セカンダリボタン
<button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
  ボタン
</button>
```

### グリッドレイアウト

```tsx
// 2カラム（モバイルは1カラム）
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  // ...
</div>
```

### 成功/ポジティブな要素

```tsx
<div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
  <div className="text-green-600 dark:text-green-400 mr-3">
    // アイコン
  </div>
  <span className="text-gray-900 dark:text-white">テキスト</span>
</div>
```

### スライダー（豚鼻デザイン）

```tsx
{/* バー本体 */}
<div className="relative h-3 flex items-center">
  {/* 背景バー（黒） */}
  <div className="absolute inset-x-0 h-2 bg-gray-900 dark:bg-gray-700 rounded-full" />

  {/* 目盛り */}
  <div className="absolute inset-x-0 h-2 flex justify-between items-center px-1">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="w-0.5 h-1.5 bg-gray-500 rounded-full" />
    ))}
  </div>

  {/* 豚鼻つまみ */}
  <div
    className="absolute w-7 h-5 bg-pig-pink rounded-full border-2 border-pig-pink-border shadow-md pointer-events-none flex items-center justify-center gap-1"
    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
  >
    <div className="w-1.5 h-2 bg-pig-pink-dark rounded-full" />
    <div className="w-1.5 h-2 bg-pig-pink-dark rounded-full" />
  </div>
</div>
```

## 実装チェックリスト

UI実装時は以下を確認:

- [ ] カスタムカラー変数を使用しているか（ハードコードしていないか）
- [ ] ダークモード対応しているか（`dark:` プレフィックス）
- [ ] フォントは `--font-zen-maru-gothic` を基本としているか
- [ ] レスポンシブ対応しているか（`md:` プレフィックス）
- [ ] 適切なスペーシング（`space-y-6`, `gap-4` など）
- [ ] ホバー状態のトランジション（`transition-colors`）
- [ ] アクセシビリティ（`aria-label` など）

## 参照ファイル

実装時は以下のファイルを参照:

- `src/app/globals.css` - カラーシステム定義
- `src/components/StoreDetail/StoreModal.tsx` - モーダルの実装例
- `src/components/ServiceTypeIcon.tsx` - アイコンコンポーネントの例
- `src/components/SpectrumBar/SpectrumBar.tsx` - スライダー（豚鼻デザイン）の実装例
