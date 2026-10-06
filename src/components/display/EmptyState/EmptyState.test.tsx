import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  test('icon, title, description and action', () => {
    const { container } = render(
      <EmptyState icon={<svg data-testid="icon" />} title="no messages" description="new mail lands here" action={<button type="button">compose</button>} />,
    )
    expect(container.querySelector('.mt-empty-state-icon')?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByText('no messages').className).toBe('mt-empty-state-title')
    expect(screen.getByText('new mail lands here').className).toBe('mt-empty-state-description')
    expect(screen.getByRole('button', { name: 'compose' }).parentElement?.className).toBe('mt-empty-state-action')
    expect((container.firstChild as HTMLElement).dataset.align).toBe('center')
  })

  test('align and keepCase', () => {
    const { container } = render(<EmptyState title="Inbox" align="start" keepCase />)
    expect((container.firstChild as HTMLElement).dataset.align).toBe('start')
    expect(screen.getByText('Inbox').hasAttribute('data-keep-case')).toBe(true)
  })
})
