import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  test('is a square text button named by its label', () => {
    render(<IconButton icon={<svg />} label="refresh" />)
    const button = screen.getByRole('button', { name: 'refresh' })
    expect(button.getAttribute('title')).toBe('refresh')
    expect(button.dataset.variant).toBe('text')
    expect(button.hasAttribute('data-icon-only')).toBe(true)
    expect(button.className).toContain('mt-icon-button')
  })

  test('takes a variant and clicks, but not when disabled', () => {
    const onClick = mock()
    const { rerender } = render(<IconButton icon={<svg />} label="add" variant="accent" onClick={onClick} />)
    const button = screen.getByRole('button', { name: 'add' })
    expect(button.dataset.variant).toBe('accent')
    fireEvent.click(button)
    rerender(<IconButton icon={<svg />} label="add" disabled onClick={onClick} />)
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
