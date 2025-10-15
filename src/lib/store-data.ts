import { Store } from '@/types/store'

/**
 * 神戸豚饅サミット店舗データを取得する
 */
export async function getStoresData(): Promise<Store[]> {
  try {
    const response = await fetch('/data/stores.json')
    if (!response.ok) {
      throw new Error(`Failed to fetch stores data: ${response.status}`)
    }
    
    const data = await response.json()
    return data.stores as Store[]
  } catch (error) {
    console.error('Error loading stores data:', error)
    return []
  }
}

/**
 * 店舗IDで特定の店舗データを取得する
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
 * 利用可能な区の一覧を取得する
 */
export async function getAvailableDistricts(): Promise<string[]> {
  const stores = await getStoresData()
  const districts = new Set(stores.map(store => store.district))
  return Array.from(districts).sort()
}