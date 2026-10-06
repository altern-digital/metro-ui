import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { SwipeItem } from './SwipeItem'

describe('SwipeItem', () => {
  test('renders the row; hidden side actions stay out of reach', () => {
    const { container } = render(
      <SwipeItem leftActions={[{ key: 'flag', label: 'flag', onClick: () => {} }]} rightActions={[{ key: 'delete', label: 'delete', tone: 'danger', onClick: () => {} }]}>
        message
      </SwipeItem>,
    )
    expect(screen.getByText('message')).toBeTruthy()
    const sides = container.querySelectorAll('.mt-swipe-item-actions')
    expect(sides).toHaveLength(2)
    for (const s of sides) expect(s.getAttribute('aria-hidden')).toBe('true')
    expect(container.querySelector<HTMLElement>('[data-side="right"] .mt-swipe-item-action')?.style.getPropertyValue('--_tone')).toBe('var(--mt-danger)')
  })

  test('the hover tray buttons are named and run their action', () => {
    const onDelete = mock()
    const onRow = mock()
    render(
      <SwipeItem rightActions={[{ key: 'delete', label: 'delete', icon: <svg />, onClick: onDelete }]} onClick={onRow}>
        message
      </SwipeItem>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onRow).not.toHaveBeenCalled()
  })

  test('without actions it is a plain row', () => {
    const { container } = render(<SwipeItem>row</SwipeItem>)
    expect(container.querySelector('.mt-swipe-item-tray')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })
})
