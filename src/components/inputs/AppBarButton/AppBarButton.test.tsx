import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { AppBarButton } from './AppBarButton'

describe('AppBarButton', () => {
  test('shows its caption and is named by it', () => {
    const onClick = mock()
    render(<AppBarButton icon={<svg />} label="new" onClick={onClick} />)
    const button = screen.getByRole('button', { name: 'new' })
    expect(button.getAttribute('type')).toBe('button')
    expect(button.hasAttribute('aria-pressed')).toBe(false)
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('compact hides the caption but keeps the name and a tooltip', () => {
    render(<AppBarButton icon={<svg />} label="share" compact />)
    const button = screen.getByRole('button', { name: 'share' })
    expect(button.getAttribute('title')).toBe('share')
    expect(screen.getByText('share').className).toBe('mt-visually-hidden')
  })

  test('pressed makes it a toggle', () => {
    render(<AppBarButton icon={<svg />} label="favourite" pressed />)
    const button = screen.getByRole('button', { name: 'favourite' })
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(button.hasAttribute('data-on')).toBe(true)
  })

  test('disabled does not click', () => {
    const onClick = mock()
    render(<AppBarButton icon={<svg />} label="x" disabled onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
