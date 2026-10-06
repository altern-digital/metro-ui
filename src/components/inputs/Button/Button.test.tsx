import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { Button } from './Button'

describe('Button', () => {
  test('renders a button with its variant and size', () => {
    render(
      <Button variant="accent" size="lg">
        save
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'save' })
    expect(button.getAttribute('type')).toBe('button')
    expect(button.dataset.variant).toBe('accent')
    expect(button.dataset.size).toBe('lg')
    expect(button.hasAttribute('data-mt-press')).toBe(true)
  })

  test('clicks, but not while disabled or loading', () => {
    const onClick = mock()
    const { rerender } = render(<Button onClick={onClick}>go</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
    rerender(
      <Button onClick={onClick} loading>
        go
      </Button>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true')
    rerender(
      <Button onClick={onClick} disabled>
        go
      </Button>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('with href it is a link', () => {
    render(<Button href="/docs">docs</Button>)
    expect(screen.getByRole('link', { name: 'docs' }).getAttribute('href')).toBe('/docs')
  })

  test('an icon without a label is icon-only', () => {
    render(<Button icon={<svg />} aria-label="add" />)
    expect(screen.getByRole('button', { name: 'add' }).hasAttribute('data-icon-only')).toBe(true)
  })

  test('takes defaults from ConfigProvider', () => {
    render(
      <ConfigProvider components={{ Button: { variant: 'primary' } }}>
        <Button>a</Button>
        <Button variant="text">b</Button>
      </ConfigProvider>,
    )
    expect(screen.getByRole('button', { name: 'a' }).dataset.variant).toBe('primary')
    expect(screen.getByRole('button', { name: 'b' }).dataset.variant).toBe('text')
  })
})
