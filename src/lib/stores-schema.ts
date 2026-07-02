import { z } from 'zod'

/**
 * stores.json のバリデーションスキーマ
 * analyze-storeスキル等でデータを追加した際、構造の破壊をテストで検出するための定義。
 * 型定義（src/types/store.ts）と対応させて管理する。
 */

/** サービス形態（StoreCategory型と対応） */
export const storeCategorySchema = z.enum(['テイクアウト', '店内飲食', '通販'])

/** スペクトラム評価値: 1-10（SpectrumFeatureAnalysis型と対応） */
const spectrumScoreSchema = z.number().min(1).max(10)

export const spectrumFeatureAnalysisSchema = z.object({
  skinStyle: spectrumScoreSchema,
  fillingStyle: spectrumScoreSchema,
  overallTaste: spectrumScoreSchema,
  size: spectrumScoreSchema,
})

/** YYYY-MM-DD形式の日付文字列 */
const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD形式で指定してください')

/** 豚饅娘の一言コメント（MusumeComment型と対応） */
export const musumeCommentSchema = z.object({
  text: z.string().min(1),
  character: z.enum(['kanon', 'saki']),
  visitDate: dateStringSchema.optional(),
})

export const extendedStoreSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    address: z.string().min(1),
    coordinates: z.object({
      // 兵庫県南部（姫路〜尼崎）の範囲
      lat: z.number().min(34.5).max(35.0),
      lng: z.number().min(134.5).max(135.6),
    }),
    district: z.string().min(1),
    businessHours: z.string().min(1),
    features: z.array(z.string().min(1)).min(1),
    description: z.string().optional(),
    googleMapsUrl: z.string().startsWith('https://'),
    categories: z.array(storeCategorySchema).min(1),
    musumeComment: musumeCommentSchema.optional(),
    aiAnalysis: z
      .object({
        features: spectrumFeatureAnalysisSchema,
        analysisDate: dateStringSchema,
      })
      .optional(),
    dataSource: z.object({
      collectionDate: dateStringSchema,
      sourceUrl: z.string(),
      isEnhanced: z.boolean(),
    }),
    benefits: z.array(z.string().min(1)).optional(),
  })
  // タイポによる未知フィールドの混入を検出する
  .strict()

export const storesFileSchema = z.object({
  stores: z.array(extendedStoreSchema).min(1),
})
