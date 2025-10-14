/**
 * Google Maps API 読み込みユーティリティ
 */

// Google Maps API型定義
interface GoogleMapsAPI {
  maps: {
    Map: new (element: HTMLElement, options: Record<string, unknown>) => unknown
    [key: string]: unknown
  }
}

// グローバル型定義の拡張
declare global {
  interface Window {
    google?: GoogleMapsAPI
  }
}

let isLoading = false
let isLoaded = false

/**
 * Google Maps APIスクリプトを動的に読み込む
 */
export function loadGoogleMapsAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    // SSR環境チェック
    if (typeof window === 'undefined') {
      reject(new Error('Google Maps APIはブラウザ環境でのみ利用可能です'))
      return
    }

    // 既に読み込み済みの場合
    if (isLoaded && window.google?.maps) {
      resolve()
      return
    }

    // 読み込み中の場合は待機
    if (isLoading) {
      const checkLoaded = () => {
        if (isLoaded && window.google?.maps) {
          resolve()
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }

    // APIキーの確認
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      reject(new Error('Google Maps APIキーが設定されていません'))
      return
    }

    isLoading = true

    // 既存のスクリプトタグをチェック
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      // 既に読み込み完了している場合
      if (window.google?.maps) {
        isLoaded = true
        isLoading = false
        resolve()
        return
      }
      
      // 読み込み中の場合は既存のスクリプトの完了を待つ
      const checkExistingLoad = () => {
        if (window.google?.maps) {
          isLoaded = true
          isLoading = false
          resolve()
        } else {
          setTimeout(checkExistingLoad, 100)
        }
      }
      checkExistingLoad()
      return
    }

    // スクリプトタグを作成
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`
    script.async = true
    script.defer = true

    script.onload = () => {
      isLoaded = true
      isLoading = false
      resolve()
    }

    script.onerror = (error) => {
      isLoading = false
      console.error('Google Maps API読み込みエラー:', error)
      reject(new Error('Google Maps APIの読み込みに失敗しました'))
    }

    // ヘッドに追加
    document.head.appendChild(script)
  })
}

/**
 * Google Maps APIが利用可能かチェック
 */
export function isGoogleMapsAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return !!(window.google?.maps)
}

/**
 * Google Maps APIが読み込まれるまで待機
 */
export function waitForGoogleMaps(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsAvailable()) {
      resolve()
      return
    }

    const startTime = Date.now()
    const checkInterval = setInterval(() => {
      if (isGoogleMapsAvailable()) {
        clearInterval(checkInterval)
        resolve()
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval)
        reject(new Error('Google Maps APIの読み込みがタイムアウトしました'))
      }
    }, 100)
  })
}