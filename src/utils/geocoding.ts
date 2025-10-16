/**
 * Google Maps Geocoding API を使用して住所から座標を取得するユーティリティ
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
}

/**
 * 住所から緯度経度を取得する
 * @param address 住所文字列
 * @returns Promise<GeocodeResult | null>
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!window.google?.maps) {
    console.error('Google Maps API が読み込まれていません');
    return null;
  }

  const geocoder = new google.maps.Geocoder();

  try {
    const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      geocoder.geocode(
        { 
          address: address,
          region: 'JP', // 日本に限定
          componentRestrictions: {
            country: 'JP',
            administrativeArea: '兵庫県',
            locality: '神戸市'
          }
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        }
      );
    });

    if (result.length > 0) {
      const location = result[0].geometry.location;
      return {
        lat: location.lat(),
        lng: location.lng()
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * 複数の住所を一括でジオコーディング
 * @param addresses 住所の配列
 * @param delay リクエスト間の遅延（ミリ秒）
 * @returns Promise<(GeocodeResult | null)[]>
 */
export async function geocodeMultipleAddresses(
  addresses: string[], 
  delay: number = 100
): Promise<(GeocodeResult | null)[]> {
  const results: (GeocodeResult | null)[] = [];

  for (const address of addresses) {
    const result = await geocodeAddress(address);
    results.push(result);
    
    // API制限を避けるための遅延
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return results;
}