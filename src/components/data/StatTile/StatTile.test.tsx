import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { StatTile } from './StatTile'

describe('StatTile', () => {
  test('shows label, formatted value and a rising delta', () => {
    const { container } = render(<StatTile label="balance" value={1250} format={(n) => `$${n}`} delta={3.5} formatDelta={(d) => `${d}%`} />)
    expect(screen.getByText('balance')).toBeTruthy()
    expect(screen.getByText('$1250')).toBeTruthy()
    const delta = container.querySelector('.mt-stat-tile-delta') as HTMLElement
    expect(delta.dataset.trend).toBe('up')
    expect(delta.dataset.good).toBe('true')
    expect(delta.textContent).toBe('+3.5%')
  })

  test('a falling delta is bad, unless inverted', () => {
    const { container, rerender } = render(<StatTile label="errors" value={4} delta={-2} />)
    const delta = () => container.querySelector('.mt-stat-tile-delta') as HTMLElement
    expect(delta().dataset.trend).toBe('down')
    expect(delta().dataset.good).toBe('false')
    rerender(<StatTile label="errors" value={4} delta={-2} invertDelta />)
    expect(delta().dataset.good).toBe('true')
  })

  test('fills with a tone', () => {
    const { container } = render(<StatTile label="users" value="1.2k" tone="blue" caption="this week" />)
    const root = container.querySelector('.mt-stat-tile') as HTMLElement
    expect(root.hasAttribute('data-filled')).toBe(true)
    expect(screen.getByText('1.2k')).toBeTruthy()
    expect(screen.getByText('this week')).toBeTruthy()
  })
})
