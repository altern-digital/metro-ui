import { describe, expect, test } from 'bun:test'
import { render } from '@testing-library/react'
import { Grid } from './Grid'

const root = (c: HTMLElement) => c.firstChild as HTMLElement

describe('Grid', () => {
  test('fixed columns', () => {
    const { container } = render(<Grid columns={3} gap={4} />)
    expect(root(container).style.getPropertyValue('--_cols')).toBe('3')
    expect(root(container).style.getPropertyValue('--_gap')).toBe('var(--mt-space-4)')
    expect(root(container).hasAttribute('data-responsive')).toBe(false)
  })

  test('responsive columns fill in from the smaller breakpoint', () => {
    const { container } = render(<Grid columns={{ compact: 1, expanded: 4 }} />)
    const el = root(container)
    expect(el.hasAttribute('data-responsive')).toBe(true)
    expect(el.style.getPropertyValue('--_cols-c')).toBe('1')
    expect(el.style.getPropertyValue('--_cols-m')).toBe('1')
    expect(el.style.getPropertyValue('--_cols-e')).toBe('4')
  })

  test('minChildWidth auto-fills and wins', () => {
    const { container } = render(<Grid columns={3} minChildWidth={240} />)
    const el = root(container)
    expect(el.hasAttribute('data-auto')).toBe(true)
    expect(el.style.getPropertyValue('--_min')).toBe('240px')
    expect(el.style.getPropertyValue('--_cols')).toBe('')
  })
})
