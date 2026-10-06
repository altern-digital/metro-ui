import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { BottomTabBar } from './BottomTabBar'

const items = [
  { key: 'home', label: 'home', icon: <svg /> },
  { key: 'mail', label: 'mail', icon: <svg />, badge: 3 },
  { key: 'docs', label: 'docs', href: '/docs' },
  { key: 'off', label: 'off', disabled: true },
]

describe('BottomTabBar', () => {
  test('renders tabs, the selected one current, fixed by default', () => {
    render(<BottomTabBar items={items} defaultValue="home" aria-label="main" />)
    const nav = screen.getByRole('navigation', { name: 'main' })
    expect(nav.dataset.position).toBe('fixed')
    expect(screen.getByRole('button', { name: 'home' }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('link', { name: 'docs' }).getAttribute('href')).toBe('/docs')
    expect(screen.getByText('3').className).toBe('mt-bottom-tab-bar-badge')
  })

  test('uncontrolled: a press selects', () => {
    const onChange = mock()
    render(<BottomTabBar items={items} defaultValue="home" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /mail/ }))
    expect(onChange).toHaveBeenCalledWith('mail')
    expect(screen.getByRole('button', { name: /mail/ }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('button', { name: 'home' }).hasAttribute('aria-current')).toBe(false)
  })

  test('controlled: follows value only', () => {
    const onChange = mock()
    render(<BottomTabBar items={items} value="home" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /mail/ }))
    expect(onChange).toHaveBeenCalledWith('mail')
    expect(screen.getByRole('button', { name: 'home' }).getAttribute('aria-current')).toBe('page')
  })

  test('disabled tabs do nothing', () => {
    const onChange = mock()
    render(<BottomTabBar items={items} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'off' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  test('links render through linkComponent', () => {
    const Link = ({ href, children, ...rest }: { href: string; children?: ReactNode }) => (
      <a {...rest} href={href} data-custom="">
        {children}
      </a>
    )
    render(<BottomTabBar items={items} linkComponent={Link} position="absolute" />)
    expect(screen.getByRole('link', { name: 'docs' }).hasAttribute('data-custom')).toBe(true)
    expect(screen.getByRole('navigation').dataset.position).toBe('absolute')
  })
})
