import React from 'react'
import { render, screen } from '@testing-library/react'
import MusumeCommentSection from '../MusumeCommentSection'
import StoreModal from '../StoreModal'
import { ExtendedStore, MusumeComment } from '@/types/store'

const mockComment: MusumeComment = {
  text: '何個でも食べられる。食べ出したら食べ切るまで止まらない',
  character: 'kanon'
}

describe('MusumeCommentSection', () => {
  it('一言コメントとキャラクター名が表示される', () => {
    render(<MusumeCommentSection comment={mockComment} />)

    expect(screen.getByText('豚饅娘の一言')).toBeInTheDocument()
    expect(
      screen.getByText('何個でも食べられる。食べ出したら食べ切るまで止まらない')
    ).toBeInTheDocument()
    expect(screen.getByText('かのん')).toBeInTheDocument()
  })

  it('キャラクターに対応したイラスト画像が表示される', () => {
    render(<MusumeCommentSection comment={mockComment} />)

    const image = screen.getByAltText('豚饅娘 かのん')
    expect(image).toHaveAttribute('src', '/images/girl-kanon-up.png')
  })

  it('sakiを指定するとさきのイラストと名前が表示される', () => {
    render(<MusumeCommentSection comment={{ ...mockComment, character: 'saki' }} />)

    expect(screen.getByText('さき')).toBeInTheDocument()
    expect(screen.getByAltText('豚饅娘 さき')).toHaveAttribute(
      'src',
      '/images/girl-saki-up.png'
    )
  })

  it('訪問日がある場合のみ表示される', () => {
    const { rerender } = render(<MusumeCommentSection comment={mockComment} />)
    expect(screen.queryByText(/訪問日/)).not.toBeInTheDocument()

    rerender(
      <MusumeCommentSection comment={{ ...mockComment, visitDate: '2026-05-10' }} />
    )
    expect(screen.getByText('訪問日: 2026-05-10')).toBeInTheDocument()
  })
})

describe('StoreModalとの連携', () => {
  const baseStore: ExtendedStore = {
    id: 'test-store',
    name: 'テスト店舗',
    address: '神戸市中央区テスト町1-2-3',
    coordinates: { lat: 34.6937, lng: 135.5023 },
    district: '中央区',
    businessHours: '10:00-18:00',
    features: ['テスト特徴'],
    googleMapsUrl: 'https://maps.google.com/?q=test',
    categories: ['テイクアウト'],
    dataSource: {
      collectionDate: '2026-01-13',
      sourceUrl: 'https://example.com',
      isEnhanced: false
    }
  }

  it('musumeCommentを持つ店舗のモーダルに一言が表示される', () => {
    render(
      <StoreModal
        isOpen={true}
        onClose={() => {}}
        store={{ ...baseStore, musumeComment: mockComment }}
      />
    )
    expect(screen.getByText('豚饅娘の一言')).toBeInTheDocument()
  })

  it('musumeCommentを持たない店舗のモーダルには表示されない', () => {
    render(<StoreModal isOpen={true} onClose={() => {}} store={baseStore} />)
    expect(screen.queryByText('豚饅娘の一言')).not.toBeInTheDocument()
  })
})
