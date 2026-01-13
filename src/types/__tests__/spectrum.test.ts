import {
  SpectrumFeatureAnalysis,
  SpectrumAxisConfig,
  SPECTRUM_AXES,
  UserPreferences,
  StoreMatchResult,
  DEFAULT_USER_PREFERENCES,
  isSpectrumFeatureAnalysis
} from '../spectrum'
import { FeatureAnalysis } from '../store'
import { ExtendedStore } from '../store'

describe('SpectrumFeatureAnalysis型定義', () => {
  it('4軸評価データを正しく保持できる', () => {
    const features: SpectrumFeatureAnalysis = {
      skinStyle: 8,
      fillingStyle: 5,
      overallTaste: 6,
      size: 3
    }

    expect(features.skinStyle).toBe(8)
    expect(features.fillingStyle).toBe(5)
    expect(features.overallTaste).toBe(6)
    expect(features.size).toBe(3)
  })

  it('各軸の値が1-10の範囲であることを想定', () => {
    const minFeatures: SpectrumFeatureAnalysis = {
      skinStyle: 1,
      fillingStyle: 1,
      overallTaste: 1,
      size: 1
    }

    const maxFeatures: SpectrumFeatureAnalysis = {
      skinStyle: 10,
      fillingStyle: 10,
      overallTaste: 10,
      size: 10
    }

    expect(minFeatures.skinStyle).toBeGreaterThanOrEqual(1)
    expect(maxFeatures.skinStyle).toBeLessThanOrEqual(10)
  })
})

describe('SpectrumAxisConfig型定義', () => {
  it('軸設定が正しいプロパティを持つ', () => {
    const config: SpectrumAxisConfig = {
      key: 'skinStyle',
      leftLabel: '薄皮ふわふわ',
      rightLabel: '厚皮もちもち'
    }

    expect(config.key).toBe('skinStyle')
    expect(config.leftLabel).toBe('薄皮ふわふわ')
    expect(config.rightLabel).toBe('厚皮もちもち')
  })
})

describe('SPECTRUM_AXES定数', () => {
  it('4つの軸設定を持つ', () => {
    expect(SPECTRUM_AXES).toHaveLength(4)
  })

  it('skinStyle軸の設定が正しい', () => {
    const skinStyleAxis = SPECTRUM_AXES.find(axis => axis.key === 'skinStyle')
    expect(skinStyleAxis).toBeDefined()
    expect(skinStyleAxis?.leftLabel).toBe('薄皮ふわふわ')
    expect(skinStyleAxis?.rightLabel).toBe('厚皮もちもち')
  })

  it('fillingStyle軸の設定が正しい', () => {
    const fillingStyleAxis = SPECTRUM_AXES.find(axis => axis.key === 'fillingStyle')
    expect(fillingStyleAxis).toBeDefined()
    expect(fillingStyleAxis?.leftLabel).toBe('あっさり')
    expect(fillingStyleAxis?.rightLabel).toBe('こってり')
  })

  it('overallTaste軸の設定が正しい', () => {
    const overallTasteAxis = SPECTRUM_AXES.find(axis => axis.key === 'overallTaste')
    expect(overallTasteAxis).toBeDefined()
    expect(overallTasteAxis?.leftLabel).toBe('優しい味')
    expect(overallTasteAxis?.rightLabel).toBe('パンチ')
  })

  it('size軸の設定が正しい', () => {
    const sizeAxis = SPECTRUM_AXES.find(axis => axis.key === 'size')
    expect(sizeAxis).toBeDefined()
    expect(sizeAxis?.leftLabel).toBe('小ぶり')
    expect(sizeAxis?.rightLabel).toBe('大ぶり')
  })

  it('すべての軸キーがSpectrumFeatureAnalysisのキーと一致', () => {
    const validKeys: (keyof SpectrumFeatureAnalysis)[] = ['skinStyle', 'fillingStyle', 'overallTaste', 'size']
    SPECTRUM_AXES.forEach(axis => {
      expect(validKeys).toContain(axis.key)
    })
  })
})

describe('UserPreferences型定義', () => {
  it('ユーザーの好み設定を正しく保持できる', () => {
    const prefs: UserPreferences = {
      skinStyle: 5,
      fillingStyle: 5,
      overallTaste: 5,
      size: 5
    }

    expect(prefs.skinStyle).toBe(5)
    expect(prefs.fillingStyle).toBe(5)
    expect(prefs.overallTaste).toBe(5)
    expect(prefs.size).toBe(5)
  })
})

describe('DEFAULT_USER_PREFERENCES定数', () => {
  it('すべての軸が中央値（5）で初期化されている', () => {
    expect(DEFAULT_USER_PREFERENCES.skinStyle).toBe(5)
    expect(DEFAULT_USER_PREFERENCES.fillingStyle).toBe(5)
    expect(DEFAULT_USER_PREFERENCES.overallTaste).toBe(5)
    expect(DEFAULT_USER_PREFERENCES.size).toBe(5)
  })
})

describe('StoreMatchResult型定義', () => {
  it('店舗とマッチ度のペアを保持できる', () => {
    const mockStore: ExtendedStore = {
      id: 'test',
      name: 'テスト店舗',
      address: '神戸市中央区',
      coordinates: { lat: 34.69, lng: 135.19 },
      district: '中央区',
      businessHours: '10:00-18:00',
      features: [],
      googleMapsUrl: 'https://maps.google.com',
      categories: ['テイクアウト'],
      dataSource: {
        collectionDate: '2026-01-13',
        sourceUrl: '',
        isEnhanced: false
      }
    }

    const result: StoreMatchResult = {
      store: mockStore,
      matchScore: 85
    }

    expect(result.store).toBe(mockStore)
    expect(result.matchScore).toBe(85)
  })

  it('マッチ度が0-100の範囲を想定', () => {
    const mockStore: ExtendedStore = {
      id: 'test',
      name: 'テスト店舗',
      address: '神戸市中央区',
      coordinates: { lat: 34.69, lng: 135.19 },
      district: '中央区',
      businessHours: '10:00-18:00',
      features: [],
      googleMapsUrl: 'https://maps.google.com',
      categories: ['テイクアウト'],
      dataSource: {
        collectionDate: '2026-01-13',
        sourceUrl: '',
        isEnhanced: false
      }
    }

    const minResult: StoreMatchResult = { store: mockStore, matchScore: 0 }
    const maxResult: StoreMatchResult = { store: mockStore, matchScore: 100 }

    expect(minResult.matchScore).toBeGreaterThanOrEqual(0)
    expect(maxResult.matchScore).toBeLessThanOrEqual(100)
  })
})

describe('isSpectrumFeatureAnalysis型ガード', () => {
  it('SpectrumFeatureAnalysis形式を正しく判定する', () => {
    const spectrumFeatures: SpectrumFeatureAnalysis = {
      skinStyle: 8,
      fillingStyle: 5,
      overallTaste: 6,
      size: 3
    }

    expect(isSpectrumFeatureAnalysis(spectrumFeatures)).toBe(true)
  })

  it('旧FeatureAnalysis形式を正しく判定する', () => {
    const legacyFeatures: FeatureAnalysis = {
      taste: 7,
      texture: 8,
      size: 6,
      priceValue: 5,
      atmosphere: 7
    }

    expect(isSpectrumFeatureAnalysis(legacyFeatures)).toBe(false)
  })
})
