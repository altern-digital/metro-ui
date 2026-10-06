import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { ProgressRing } from './ProgressRing'

describe('ProgressRing', () => {
  test('indeterminate: five orbiting dots, named loading', () => {
    render(<ProgressRing />)
    const ring = screen.getByRole('progressbar', { name: 'loading…' })
    expect(ring.className).toBe('mt-progress-ring')
    expect(ring.dataset.size).toBe('md')
    expect(ring.style.getPropertyValue('--_size')).toBe('32px')
    expect(ring.querySelectorAll('i')).toHaveLength(5)
    expect(ring.hasAttribute('aria-valuenow')).toBe(false)
  })

  test('size in px, tone and label', () => {
    render(<ProgressRing size={48} tone="orange" label="syncing" />)
    const ring = screen.getByRole('progressbar', { name: 'syncing' })
    expect(ring.style.getPropertyValue('--_size')).toBe('48px')
    expect(ring.style.getPropertyValue('--_tone')).toBe('var(--mt-tone-orange)')
    expect(ring.dataset.size).toBeUndefined()
  })

  test('determinate: an arc with values', () => {
    const { container } = render(<ProgressRing value={60} size="lg" />)
    const ring = screen.getByRole('progressbar')
    expect(ring.getAttribute('aria-valuenow')).toBe('60')
    expect(ring.hasAttribute('data-determinate')).toBe(true)
    expect(container.querySelector('.mt-progress-ring-arc')?.getAttribute('stroke-dasharray')).toBe('60 100')
  })
})
