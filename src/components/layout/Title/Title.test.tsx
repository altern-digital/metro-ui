import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { Subtitle, Title } from './Title'

describe('Title', () => {
  test('renders the heading for its level', () => {
    render(<Title>settings</Title>)
    const h = screen.getByRole('heading', { level: 1, name: 'settings' })
    expect(h.className).toBe('mt-title')
    expect(h.dataset.level).toBe('1')
  })

  test('level, as and keepCase', () => {
    render(
      <Title level={3} as="div" keepCase>
        Accounts
      </Title>,
    )
    const el = screen.getByText('Accounts')
    expect(el.tagName).toBe('DIV')
    expect(el.dataset.level).toBe('3')
    expect(el.hasAttribute('data-keep-case')).toBe(true)
  })

  test('Subtitle is a paragraph', () => {
    render(<Subtitle className="x">this device</Subtitle>)
    const el = screen.getByText('this device')
    expect(el.tagName).toBe('P')
    expect(el.className).toBe('mt-subtitle x')
  })
})
