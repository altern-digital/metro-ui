import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { Divider } from './Divider'

describe('Divider', () => {
  test('a horizontal separator', () => {
    render(<Divider />)
    const el = screen.getByRole('separator')
    expect(el.getAttribute('aria-orientation')).toBe('horizontal')
    expect(el.dataset.orientation).toBe('horizontal')
    expect(el.hasAttribute('data-labelled')).toBe(false)
  })

  test('with a label', () => {
    render(<Divider label="or" />)
    expect(screen.getByRole('separator').hasAttribute('data-labelled')).toBe(true)
    expect(screen.getByText('or').className).toBe('mt-divider-label')
  })

  test('vertical ignores the label', () => {
    render(<Divider orientation="vertical" label="or" />)
    const el = screen.getByRole('separator')
    expect(el.getAttribute('aria-orientation')).toBe('vertical')
    expect(el.textContent).toBe('')
  })
})
