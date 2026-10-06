import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { Text } from './Text'

describe('Text', () => {
  test('a span by default, with no data attributes', () => {
    render(<Text>hello</Text>)
    const el = screen.getByText('hello')
    expect(el.tagName).toBe('SPAN')
    expect(el.dataset.tone).toBeUndefined()
    expect(el.dataset.size).toBeUndefined()
  })

  test('props become data attributes', () => {
    render(
      <Text as="p" size="lg" tone="muted" weight={300} mono truncate>
        hello
      </Text>,
    )
    const el = screen.getByText('hello')
    expect(el.tagName).toBe('P')
    expect(el.dataset.size).toBe('lg')
    expect(el.dataset.tone).toBe('muted')
    expect(el.dataset.weight).toBe('300')
    expect(el.hasAttribute('data-mono')).toBe(true)
    expect(el.hasAttribute('data-truncate')).toBe(true)
  })

  test('takes defaults from ConfigProvider', () => {
    render(
      <ConfigProvider components={{ Text: { tone: 'accent' } }}>
        <Text>a</Text>
      </ConfigProvider>,
    )
    expect(screen.getByText('a').dataset.tone).toBe('accent')
  })
})
