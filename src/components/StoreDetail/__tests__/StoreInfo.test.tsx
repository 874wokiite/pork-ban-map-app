import React from 'react'
import { render, screen } from '@testing-library/react'
import StoreInfo from '../StoreInfo'
import { Store } from '@/types/store'

const mockStore: Store = {
  id: 'test-store',
  name: 'テスト店舗',
  address: '〒650-0001 兵庫県神戸市中央区テスト町1-2-3',
  coordinates: { lat: 34.6937, lng: 135.5023 },
  district: '中央区',
  businessHours: '10:00-18:00 (定休日: 月曜)',
  features: ['テスト特徴1', 'テスト特徴2', '特別な味'],
  description: 'テスト店舗の説明文です。美味しい豚饅を提供しています。',
  googleMapsUrl: 'https://maps.google.com/?q=test',
  categories: ['テイクアウト', '店内飲食']
}

describe('StoreInfo', () => {
  it('店舗の基本情報が正しく表示される', () => {
    render(<StoreInfo store={mockStore} />)
    
    expect(screen.getByText('〒650-0001 兵庫県神戸市中央区テスト町1-2-3')).toBeInTheDocument()
    expect(screen.getByText('10:00-18:00 (定休日: 月曜)')).toBeInTheDocument()
  })

  it('特徴タグが正しく表示される', () => {
    render(<StoreInfo store={mockStore} />)
    
    expect(screen.getByText('テスト特徴1')).toBeInTheDocument()
    expect(screen.getByText('テスト特徴2')).toBeInTheDocument()
    expect(screen.getByText('特別な味')).toBeInTheDocument()
  })

  it('説明文が表示される', () => {
    render(<StoreInfo store={mockStore} />)
    
    expect(screen.getByText('テスト店舗の説明文です。美味しい豚饅を提供しています。')).toBeInTheDocument()
  })

  it('Googleマップリンクが正しく設定される', () => {
    render(<StoreInfo store={mockStore} />)
    
    const googleMapLink = screen.getByRole('link', { name: 'Googleマップで開く' })
    expect(googleMapLink).toHaveAttribute('href', 'https://maps.google.com/?q=test')
    expect(googleMapLink).toHaveAttribute('target', '_blank')
    expect(googleMapLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  // 電話番号フィールドが現在のStore型に存在しないためコメントアウト
  // it('電話番号が表示される', () => {
  //   render(<StoreInfo store={mockStore} />)
  //   
  //   expect(screen.getByText('078-123-4567')).toBeInTheDocument()
  // })

  // ウェブサイトフィールドが現在のStore型に存在しないためコメントアウト
  // it('ウェブサイトリンクが表示される', () => {
  //   render(<StoreInfo store={mockStore} />)
  //   
  //   const websiteLink = screen.getByRole('link', { name: '公式サイト' })
  //   expect(websiteLink).toHaveAttribute('href', 'https://example.com')
  //   expect(websiteLink).toHaveAttribute('target', '_blank')
  // })

  it('オプション項目がない場合は表示されない', () => {
    const storeWithoutOptionals: Store = {
      ...mockStore,
      description: undefined
    }
    
    render(<StoreInfo store={storeWithoutOptionals} />)
    
    // 電話番号とウェブサイトフィールドが現在のStore型に存在しないためコメントアウト
    // expect(screen.queryByText('078-123-4567')).not.toBeInTheDocument()
    // expect(screen.queryByRole('link', { name: '公式サイト' })).not.toBeInTheDocument()
    expect(screen.queryByText('テスト店舗の説明文です。美味しい豚饅を提供しています。')).not.toBeInTheDocument()
  })

  it('サービス形態が表示される', () => {
    render(<StoreInfo store={mockStore} />)
    
    expect(screen.getByText('テイクアウト')).toBeInTheDocument()
    expect(screen.getByText('店内飲食')).toBeInTheDocument()
  })
})