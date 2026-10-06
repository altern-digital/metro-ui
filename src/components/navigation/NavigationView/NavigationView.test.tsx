import { afterEach, describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { NavigationView, type NavItem } from './NavigationView'

const items: NavItem[] = [
  { key: 'home', label: 'home', icon: <svg /> },
  { key: 'mail', label: 'mail', icon: <svg />, badge: 2 },
  { key: 'docs', label: 'docs', href: '/docs' },
  {
    key: 'lib',
    label: 'library',
    items: [
      { key: 'music', label: 'music' },
      { key: 'video', label: 'video' },
    ],
  },
]
const footerItems: NavItem[] = [{ key: 'settings', label: 'settings' }]

afterEach(() => localStorage.clear())

describe('NavigationView', () => {
  test('expanded: a wide pane of labelled rows beside the page', () => {
    const { container } = render(
      <NavigationView items={items} footerItems={footerItems} mode="expanded" defaultValue="home" header="app">
        <p>page</p>
      </NavigationView>,
    )
    expect(container.querySelector<HTMLElement>('.mt-navigation-view')?.dataset.mode).toBe('expanded')
    const nav = screen.getByRole('navigation', { name: 'menu' })
    expect(nav.dataset.wide).toBe('')
    expect(within(nav).getByRole('button', { name: 'home' }).getAttribute('aria-current')).toBe('page')
    expect(within(nav).getByRole('link', { name: 'docs' }).getAttribute('href')).toBe('/docs')
    expect(screen.getByText('page')).toBeTruthy()
  })

  test('uncontrolled: a row selects; groups fold open', () => {
    const onChange = mock()
    render(<NavigationView items={items} mode="expanded" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /mail/ }))
    expect(onChange).toHaveBeenCalledWith('mail')
    expect(screen.getByRole('button', { name: /mail/ }).getAttribute('aria-current')).toBe('page')
    const group = screen.getByRole('button', { name: 'library' })
    expect(group.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(group)
    expect(group.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'music' }))
    expect(onChange).toHaveBeenLastCalledWith('music')
  })

  test('controlled: follows value', () => {
    const onChange = mock()
    render(<NavigationView items={items} mode="expanded" value="home" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /mail/ }))
    expect(onChange).toHaveBeenCalledWith('mail')
    expect(screen.getByRole('button', { name: 'home' }).getAttribute('aria-current')).toBe('page')
  })

  test('arrow keys move between rows', () => {
    render(<NavigationView items={items} mode="expanded" />)
    const home = screen.getByRole('button', { name: 'home' })
    home.focus()
    fireEvent.keyDown(home, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /mail/ }))
    fireEvent.keyDown(document.activeElement!, { key: 'End' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'library' }))
    fireEvent.keyDown(document.activeElement!, { key: 'Home' })
    expect(document.activeElement).toBe(home)
  })

  test('the menu button collapses the pane and storageKey remembers it', () => {
    const { unmount } = render(<NavigationView items={items} mode="expanded" storageKey="nav" />)
    const burger = screen.getByRole('button', { name: 'menu' })
    expect(burger.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(burger)
    expect(screen.getByRole('navigation').hasAttribute('data-wide')).toBe(false)
    expect(localStorage.getItem('nav')).toBe('1')
    unmount()
    render(<NavigationView items={items} mode="expanded" storageKey="nav" />)
    expect(screen.getByRole('button', { name: 'menu' }).getAttribute('aria-expanded')).toBe('false')
  })

  test('compact: icons with hidden labels; the menu lays the full pane over', async () => {
    render(<NavigationView items={items} mode="compact" />)
    const nav = screen.getByRole('navigation')
    expect(nav.hasAttribute('data-wide')).toBe(false)
    expect(within(nav).getByText('home').className).toBe('mt-visually-hidden')
    fireEvent.click(screen.getByRole('button', { name: 'menu' }))
    const navs = screen.getAllByRole('navigation')
    expect(navs).toHaveLength(2)
    expect(navs[1]!.dataset.floating).toBe('')
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.getAllByRole('navigation')).toHaveLength(1))
  })

  test('minimal: no pane, a menu button in the top bar', () => {
    render(<NavigationView items={items} mode="minimal" header="app" />)
    expect(screen.queryByRole('navigation')).toBeNull()
    const burger = screen.getByRole('button', { name: 'menu' })
    fireEvent.click(burger)
    expect(burger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('navigation').dataset.floating).toBe('')
  })

  test('bottom: a tab bar, the rest under more', async () => {
    const onChange = mock()
    render(<NavigationView items={items} footerItems={footerItems} mode="bottom" bottomItems={2} position="absolute" onChange={onChange} />)
    const bar = screen.getByRole('navigation')
    expect(bar.className).toContain('mt-bottom-tab-bar')
    expect(bar.dataset.position).toBe('absolute')
    expect(within(bar).getAllByRole('button')).toHaveLength(3)
    expect(within(bar).getByRole('button', { name: /mail/ })).toBeTruthy()
    fireEvent.click(within(bar).getByRole('button', { name: 'more' }))
    const sheet = screen.getByRole('dialog', { name: 'more' })
    expect(within(sheet).getByRole('group', { name: 'library' })).toBeTruthy()
    fireEvent.click(within(sheet).getByRole('button', { name: 'settings' }))
    expect(onChange).toHaveBeenCalledWith('settings')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(within(bar).getByRole('button', { name: 'more' }).getAttribute('aria-current')).toBe('page')
  })

  test('auto is bottom on a phone', () => {
    const { container } = render(
      <ConfigProvider platform="mobile">
        <NavigationView items={items} />
      </ConfigProvider>,
    )
    expect(container.querySelector<HTMLElement>('.mt-navigation-view')?.dataset.mode).toBe('bottom')
  })
})
