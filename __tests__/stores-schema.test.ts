import fs from 'fs'
import path from 'path'
import { storesFileSchema } from '@/lib/stores-schema'

/**
 * stores.json のスキーマバリデーションテスト
 * データ追加・編集時の構造破壊（必須フィールド欠落、不正なカテゴリ、座標範囲外など）を検出する
 */
describe('stores.json スキーマ検証', () => {
  const storesPath = path.join(process.cwd(), 'public', 'data', 'stores.json')
  const storesData = JSON.parse(fs.readFileSync(storesPath, 'utf-8'))

  test('全店舗データがスキーマに準拠していること', () => {
    const result = storesFileSchema.safeParse(storesData)

    if (!result.success) {
      // どの店舗のどのフィールドが不正か分かるエラーメッセージを組み立てる
      const details = result.error.issues
        .map(issue => {
          const storeIndex = issue.path[1]
          const storeId =
            typeof storeIndex === 'number'
              ? (storesData.stores[storeIndex]?.id ?? `index ${storeIndex}`)
              : '(root)'
          return `- [${storeId}] ${issue.path.join('.')}: ${issue.message}`
        })
        .join('\n')
      throw new Error(`stores.json のスキーマ違反:\n${details}`)
    }

    expect(result.success).toBe(true)
  })

  test('店舗IDがユニークであること', () => {
    const ids = storesData.stores.map((store: { id: string }) => store.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
