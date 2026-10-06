import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  test('shows the count in the accent', () => {
    render(<Badge count={5} />)
    const badge = screen.getByText('5')
    expect(badge.className).toBe('mt-badge')
    expect(badge.dataset.tone).toBe('accent')
    expect(badge.style.getPropertyValue('--_tone')).toBe('var(--mt-accent)')
  })

  test('caps at max', () => {
    render(<Badge count={120} />)
    expect(screen.getByText('99+')).toBeTruthy()
    render(<Badge count={12} max={9} />)
    expect(screen.getByText('9+')).toBeTruthy()
  })

  test('zero hides unless showZero', () => {
    const { container, rerender } = render(<Badge count={0} />)
    expect(container.firstChild).toBeNull()
    rerender(<Badge count={0} showZero />)
    expect(screen.getByText('0')).toBeTruthy()
  })

  test('a dot is empty and hidden unless labelled', () => {
    const { container, rerender } = render(<Badge dot tone="success" />)
    const dot = container.querySelector('.mt-badge') as HTMLElement
    expect(dot.hasAttribute('data-dot')).toBe(true)
    expect(dot.getAttribute('aria-hidden')).toBe('true')
    rerender(<Badge dot label="online" />)
    expect(screen.getByRole('status', { name: 'online' })).toBeTruthy()
  })

  test('wraps children and sits on their corner', () => {
    render(
      <Badge count={3} label="3 unread" className="x">
        <button type="button">mail</button>
      </Badge>,
    )
    const anchor = screen.getByRole('button', { name: 'mail' }).parentElement!
    expect(anchor.className).toBe('mt-badge-anchor x')
    expect(screen.getByRole('status', { name: '3 unread' }).parentElement).toBe(anchor)
  })
})
