import { describe, expect, test } from 'bun:test'
import { render } from '@testing-library/react'
import { Stack } from './Stack'

describe('Stack', () => {
  test('a column with the default gap', () => {
    const { container } = render(<Stack>x</Stack>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toBe('mt-stack')
    expect(el.dataset.direction).toBe('column')
    expect(el.style.getPropertyValue('--_gap')).toBe('var(--mt-space-3)')
  })

  test('props become data attributes and the gap variable', () => {
    const { container } = render(
      <Stack as="ul" direction="row" gap={0} align="center" justify="between" wrap style={{ color: 'red' }}>
        <li>x</li>
      </Stack>,
    )
    const el = container.firstChild as HTMLElement
    expect(el.tagName).toBe('UL')
    expect(el.dataset.direction).toBe('row')
    expect(el.dataset.align).toBe('center')
    expect(el.dataset.justify).toBe('between')
    expect(el.hasAttribute('data-wrap')).toBe(true)
    expect(el.style.getPropertyValue('--_gap')).toBe('0px')
    expect(el.style.color).toBe('red')
  })
})
