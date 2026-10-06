import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { Pivot } from './Pivot'

const items = [
  { key: 'all', label: 'all', content: <p>everything</p> },
  { key: 'unread', label: 'unread', content: <p>new ones</p> },
  { key: 'flagged', label: 'flagged', content: <p>marked</p>, disabled: true },
  { key: 'urgent', label: 'urgent', content: <p>now</p> },
]

describe('Pivot', () => {
  test('renders tabs and the first view', () => {
    render(<Pivot items={items} />)
    expect(screen.getAllByRole('tab')).toHaveLength(4)
    const tab = screen.getByRole('tab', { name: 'all' })
    expect(tab.getAttribute('aria-selected')).toBe('true')
    expect(tab.tabIndex).toBe(0)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toBe('everything')
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id)
    expect(tab.getAttribute('aria-controls')).toBe(panel.id)
  })

  test('uncontrolled: a press switches the view', () => {
    const onChange = mock()
    render(<Pivot items={items} onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'unread' }))
    expect(onChange).toHaveBeenCalledWith('unread')
    expect(screen.getByRole('tab', { name: 'unread' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByText('new ones')).toBeTruthy()
  })

  test('controlled: follows value', () => {
    const onChange = mock()
    const { rerender } = render(<Pivot items={items} value="unread" onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'all' }))
    expect(onChange).toHaveBeenCalledWith('all')
    expect(screen.getByRole('tab', { name: 'unread' }).getAttribute('aria-selected')).toBe('true')
    rerender(<Pivot items={items} value="all" onChange={onChange} />)
    expect(screen.getByRole('tab', { name: 'all' }).getAttribute('aria-selected')).toBe('true')
  })

  test('arrows skip disabled tabs and wrap; Home and End', () => {
    render(<Pivot items={items} defaultValue="unread" />)
    const list = screen.getByRole('tablist')
    fireEvent.keyDown(list, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'urgent' }).getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'urgent' }))
    fireEvent.keyDown(list, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'all' }).getAttribute('aria-selected')).toBe('true')
    fireEvent.keyDown(list, { key: 'End' })
    expect(screen.getByRole('tab', { name: 'urgent' }).getAttribute('aria-selected')).toBe('true')
    fireEvent.keyDown(list, { key: 'Home' })
    expect(screen.getByRole('tab', { name: 'all' }).getAttribute('aria-selected')).toBe('true')
  })

  test('headerOnly renders no panel', () => {
    render(<Pivot items={items} headerOnly />)
    expect(screen.queryByRole('tabpanel')).toBeNull()
    expect(screen.getByRole('tab', { name: 'all' }).hasAttribute('aria-controls')).toBe(false)
  })
})
