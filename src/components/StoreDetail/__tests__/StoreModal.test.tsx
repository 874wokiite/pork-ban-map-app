import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import StoreModal from '../StoreModal'
import { Store } from '@/types/store'

const mockStore: Store = {
  id: 'test-store',
  name: 'テスト店舗',
  address: '〒650-0001 兵庫県神戸市中央区テスト町1-2-3',
  coordinates: { lat: 34.6937, lng: 135.5023 },
  district: '中央区',
  businessHours: '10:00-18:00 (定休日: 月曜)',
  price: 150,
  features: ['テスト特徴1', 'テスト特徴2'],
  description: 'テスト店舗の説明文',
  images: ['/images/test/test1.jpg'],
  phone: '078-123-4567',
  website: 'https://example.com',
  googleMapsUrl: 'https://maps.google.com/?q=test',
  categories: ['テイクアウト']
}

describe('StoreModal', () => {
  it('isOpenがtrueの時にモーダルが表示される', () => {
    render(
      <StoreModal 
        isOpen={true} 
        onClose={() => {}} 
        store={mockStore} 
      />
    )
    
    expect(screen.getByText('テスト店舗')).toBeInTheDocument()
    expect(screen.getByText('〒650-0001 兵庫県神戸市中央区テスト町1-2-3')).toBeInTheDocument()
  })

  it('isOpenがfalseの時にモーダルが表示されない', () => {
    render(
      <StoreModal 
        isOpen={false} 
        onClose={() => {}} 
        store={mockStore} 
      />
    )
    
    expect(screen.queryByText('テスト店舗')).not.toBeInTheDocument()
  })

  it('閉じるボタンをクリックした時にonCloseが呼ばれる', () => {
    const mockOnClose = jest.fn()
    
    render(
      <StoreModal 
        isOpen={true} 
        onClose={mockOnClose} 
        store={mockStore} 
      />
    )
    
    const closeButton = screen.getByRole('button', { name: '閉じる' })
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('背景をクリックした時にonCloseが呼ばれる', () => {
    const mockOnClose = jest.fn()
    
    render(
      <StoreModal 
        isOpen={true} 
        onClose={mockOnClose} 
        store={mockStore} 
      />
    )
    
    const backdrop = screen.getByTestId('modal-backdrop')
    fireEvent.click(backdrop)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('Escキーを押した時にonCloseが呼ばれる', () => {
    const mockOnClose = jest.fn()
    
    render(
      <StoreModal 
        isOpen={true} 
        onClose={mockOnClose} 
        store={mockStore} 
      />
    )
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('storeがnullの時はモーダルが表示されない', () => {
    render(
      <StoreModal 
        isOpen={true} 
        onClose={() => {}} 
        store={null} 
      />
    )
    
    expect(screen.queryByText('テスト店舗')).not.toBeInTheDocument()
  })
})