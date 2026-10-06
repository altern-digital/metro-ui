import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { BarChart } from './BarChart'

const data = [
  { label: 'jan', value: 10 },
  { label: 'feb', value: 20, tone: 'red' },
  { label: 'mar', value: 5 },
]

describe('BarChart', () => {
  test('is an image with a summary of every value', () => {
    render(<BarChart label="sales" data={data} format={(n) => `${n}k`} />)
    expect(screen.getByRole('img', { name: 'sales: jan 10k, feb 20k, mar 5k' })).toBeTruthy()
  })

  test('scales bars to the largest value, or to max', () => {
    const { container, rerender } = render(<BarChart data={data} />)
    const ratios = () => [...container.querySelectorAll<HTMLElement>('.mt-bar-chart-item')].map((el) => el.style.getPropertyValue('--_ratio'))
    expect(ratios()).toEqual(['0.5', '1', '0.25'])
    rerender(<BarChart data={data} max={40} />)
    expect(ratios()).toEqual(['0.25', '0.5', '0.125'])
  })

  test('orientation, per-bar tone and hidden values', () => {
    const { container } = render(<BarChart data={data} orientation="horizontal" showValues={false} />)
    const root = container.querySelector('.mt-bar-chart') as HTMLElement
    expect(root.dataset.orientation).toBe('horizontal')
    expect(container.querySelector('.mt-bar-chart-value')).toBeNull()
    const feb = container.querySelectorAll<HTMLElement>('.mt-bar-chart-item')[1]!
    expect(feb.style.getPropertyValue('--_bar')).toBe('var(--mt-tone-red)')
  })
})
