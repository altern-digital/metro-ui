import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Breadcrumb } from './Breadcrumb'

const items = [
  { key: 'home', label: 'home', href: '/' },
  { key: 'docs', label: 'docs', href: '/docs' },
  { key: 'nav', label: 'navigation', href: '/docs/nav' },
  { key: 'pivot', label: 'pivot' },
]

describe('Breadcrumb', () => {
  test('links each level; the last is the current page', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeTruthy()
    expect(screen.getAllByRole('link')).toHaveLength(3)
    const current = screen.getByText('pivot')
    expect(current.getAttribute('aria-current')).toBe('page')
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  test('folds the middle past maxItems, and unfolds on press', () => {
    render(<Breadcrumb items={items} maxItems={3} />)
    expect(screen.queryByRole('link', { name: 'docs' })).toBeNull()
    expect(screen.getByRole('link', { name: 'home' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'navigation' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'more' }))
    expect(screen.getByRole('link', { name: 'docs' })).toBeTruthy()
  })

  test('onClick items are buttons; linkComponent renders links', () => {
    const onClick = mock()
    const Link = ({ children, ...rest }: { children?: ReactNode }) => (
      <a {...rest} data-custom="">
        {children}
      </a>
    )
    render(<Breadcrumb linkComponent={Link} items={[{ key: 'a', label: 'a', href: '/a' }, { key: 'b', label: 'b', onClick }, { key: 'c', label: 'c' }]} />)
    expect(screen.getByRole('link', { name: 'a' }).hasAttribute('data-custom')).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'b' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
