import { Store, ExtendedStore } from '@/types/store'

/**
 * 神戸豚饅サミット店舗データを取得する（ExtendedStore対応）
 */
export async function getExtendedStoresData(): Promise<ExtendedStore[]> {
  try {
    const response = await fetch('/data/stores.json')
    if (!response.ok) {
      throw new Error(`Failed to fetch stores data: ${response.status}`)
    }
    
    const data = await response.json()
    return data.stores as ExtendedStore[]
  } catch (error) {
    console.error('Error loading extended stores data:', error)
    return []
  }
}

/**
 * 神戸豚饅サミット店舗データを取得する（後方互換性維持）
 */
export async function getStoresData(): Promise<Store[]> {
  const extendedStores = await getExtendedStoresData()
  // ExtendedStoreからStore型に変換（aiAnalysisとdataSourceを除外）
  return extendedStores.map(store => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { aiAnalysis, dataSource, ...baseStore } = store
    return baseStore as Store
  })
}

/**
 * 店舗IDで特定の拡張店舗データを取得する
 */
export async function getExtendedStoreById(id: string): Promise<ExtendedStore | null> {
  const stores = await getExtendedStoresData()
  return stores.find(store => store.id === id) || null
}

/**
 * AI分析データがある店舗のみを取得する
 */
export async function getStoresWithAnalysis(): Promise<ExtendedStore[]> {
  const stores = await getExtendedStoresData()
  return stores.filter(store => store.aiAnalysis !== undefined)
}

/**
 * 店舗IDで特定の店舗データを取得する（後方互換性維持）
 */
export async function getStoreById(id: string): Promise<Store | null> {
  const stores = await getStoresData()
  return stores.find(store => store.id === id) || null
}

/**
 * 区で店舗をフィルタリングする
 */
export async function getStoresByDistrict(district: string): Promise<Store[]> {
  const stores = await getStoresData()
  return stores.filter(store => store.district === district)
}

/**
 * 拡張データで区で店舗をフィルタリングする
 */
export async function getExtendedStoresByDistrict(district: string): Promise<ExtendedStore[]> {
  const stores = await getExtendedStoresData()
  return stores.filter(store => store.district === district)
}

/**
 * 利用可能な区の一覧を取得する
 */
export async function getAvailableDistricts(): Promise<string[]> {
  const stores = await getStoresData()
  const districts = new Set(stores.map(store => store.district))
  return Array.from(districts).sort()
}