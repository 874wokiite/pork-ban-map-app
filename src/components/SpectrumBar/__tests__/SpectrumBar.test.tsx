import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import SpectrumBar from '../SpectrumBar'
import { SpectrumAxisConfig } from '@/types/spectrum'

const mockAxisConfig: SpectrumAxisConfig = {
  key: 'skinStyle',
  leftLabel: '薄皮ふわふわ',
  rightLabel: '厚皮もちもち'
}

describe('SpectrumBar', () => {
  describe('読み取り専用モード', () => {
    it('両端ラベルが正しく表示される', () => {
      render(<SpectrumBar axis={mockAxisConfig} value={5} readonly />)

      expect(screen.getByText('薄皮ふわふわ')).toBeInTheDocument()
      expect(screen.getByText('厚皮もちもち')).toBeInTheDocument()
    })

    it('インジケーターが正しい位置に表示される（中央値5の場合）', () => {
      const { container } = render(<SpectrumBar axis={mockAxisConfig} value={5} readonly />)

      // インジケーターの位置は(value - 1) / 9 * 100で計算
      // value=5 の場合: (5 - 1) / 9 * 100 = 44.44%
      const indicator = container.querySelector('[data-testid="spectrum-indicator"]')
      expect(indicator).toBeInTheDocument()
    })

    it('最小値（1）でインジケーターが左端に表示される', () => {
      const { container } = render(<SpectrumBar axis={mockAxisConfig} value={1} readonly />)

      const indicator = container.querySelector('[data-testid="spectrum-indicator"]')
      expect(indicator).toHaveStyle({ left: '0%' })
    })

    it('最大値（10）でインジケーターが右端に表示される', () => {
      const { container } = render(<SpectrumBar axis={mockAxisConfig} value={10} readonly />)

      const indicator = container.querySelector('[data-testid="spectrum-indicator"]')
      expect(indicator).toHaveStyle({ left: '100%' })
    })

    it('読み取り専用モードではスライダーが操作できない', () => {
      const { container } = render(<SpectrumBar axis={mockAxisConfig} value={5} readonly />)

      const slider = container.querySelector('input[type="range"]')
      expect(slider).toBeNull()
    })
  })

  describe('スライダーモード', () => {
    it('スライダーが表示される', () => {
      render(<SpectrumBar axis={mockAxisConfig} value={5} onChange={jest.fn()} />)

      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
    })

    it('スライダー操作で値が変更される', () => {
      const handleChange = jest.fn()
      render(<SpectrumBar axis={mockAxisConfig} value={5} onChange={handleChange} />)

      const slider = screen.getByRole('slider')
      fireEvent.change(slider, { target: { value: '7' } })

      expect(handleChange).toHaveBeenCalledWith(7)
    })

    it('スライダーの範囲が1-10に設定されている', () => {
      render(<SpectrumBar axis={mockAxisConfig} value={5} onChange={jest.fn()} />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('min', '1')
      expect(slider).toHaveAttribute('max', '10')
    })

    it('現在の値がスライダーに反映されている', () => {
      render(<SpectrumBar axis={mockAxisConfig} value={7} onChange={jest.fn()} />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveValue('7')
    })
  })

  describe('アクセシビリティ', () => {
    it('スライダーにラベルが関連付けられている', () => {
      render(<SpectrumBar axis={mockAxisConfig} value={5} onChange={jest.fn()} />)

      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-label')
    })
  })

  describe('異なる軸設定', () => {
    it('fillingStyle軸のラベルが正しく表示される', () => {
      const fillingStyleAxis: SpectrumAxisConfig = {
        key: 'fillingStyle',
        leftLabel: 'あっさり',
        rightLabel: 'こってり'
      }

      render(<SpectrumBar axis={fillingStyleAxis} value={5} readonly />)

      expect(screen.getByText('あっさり')).toBeInTheDocument()
      expect(screen.getByText('こってり')).toBeInTheDocument()
    })

    it('overallTaste軸のラベルが正しく表示される', () => {
      const overallTasteAxis: SpectrumAxisConfig = {
        key: 'overallTaste',
        leftLabel: '優しい味',
        rightLabel: 'パンチ'
      }

      render(<SpectrumBar axis={overallTasteAxis} value={5} readonly />)

      expect(screen.getByText('優しい味')).toBeInTheDocument()
      expect(screen.getByText('パンチ')).toBeInTheDocument()
    })

    it('size軸のラベルが正しく表示される', () => {
      const sizeAxis: SpectrumAxisConfig = {
        key: 'size',
        leftLabel: '小ぶり',
        rightLabel: '大ぶり'
      }

      render(<SpectrumBar axis={sizeAxis} value={5} readonly />)

      expect(screen.getByText('小ぶり')).toBeInTheDocument()
      expect(screen.getByText('大ぶり')).toBeInTheDocument()
    })
  })
})
