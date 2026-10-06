import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ListItem, ListView } from './ListView'

const people = [
  { id: 1, name: 'adam' },
  { id: 2, name: 'alice' },
  { id: 3, name: 'bea' },
]

describe('ListView', () => {
  test('renders a list with a header and items', () => {
    render(
      <ListView header="recent">
        <ListItem title="mail" subtitle="3 unread" meta="9:41" />
        <ListItem title="calendar" />
      </ListView>,
    )
    const list = screen.getByRole('list', { name: 'recent' })
    expect(list).toBeTruthy()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('3 unread')).toBeTruthy()
  })

  test('groups items under letter headers', () => {
    const { container } = render(
      <ListView id="people" items={people} groupBy={(p) => p.name[0]!} renderItem={(p) => <ListItem title={p.name} />} />,
    )
    const a = container.querySelector('#people-group-a') as HTMLElement
    expect(a.dataset.group).toBe('a')
    expect(container.querySelector('#people-group-b')).toBeTruthy()
    expect(screen.getByRole('list', { name: 'a' }).querySelectorAll('[role=listitem]')).toHaveLength(2)
  })

  test('selects one item (uncontrolled)', () => {
    const onChange = mock()
    render(<ListView selectionMode="single" items={people} onSelectionChange={onChange} renderItem={(p) => <ListItem title={p.name} />} />)
    const options = screen.getAllByRole('option')
    fireEvent.click(options[1]!)
    expect(onChange).toHaveBeenLastCalledWith([2])
    expect(options[1]!.getAttribute('aria-selected')).toBe('true')
    fireEvent.click(options[2]!)
    expect(options[1]!.getAttribute('aria-selected')).toBe('false')
    expect(options[2]!.getAttribute('aria-selected')).toBe('true')
  })

  test('selects many (controlled) and keyboard toggles', () => {
    const onChange = mock()
    render(
      <ListView selectionMode="multiple" selected={[1]} onSelectionChange={onChange} items={people} renderItem={(p) => <ListItem title={p.name} />} />,
    )
    expect(screen.getByRole('listbox').getAttribute('aria-multiselectable')).toBe('true')
    const options = screen.getAllByRole('option')
    fireEvent.keyDown(options[2]!, { key: ' ' })
    expect(onChange).toHaveBeenLastCalledWith([1, 3])
    // Controlled: nothing changes until the parent passes new keys.
    expect(options[2]!.getAttribute('aria-selected')).toBe('false')
  })

  test('moves focus with arrows, Home and End, one tab stop', () => {
    render(<ListView selectionMode="single" defaultSelected={[2]} items={people} renderItem={(p) => <ListItem title={p.name} />} />)
    const options = screen.getAllByRole('option')
    expect(options.map((o) => o.tabIndex)).toEqual([-1, 0, -1])
    options[1]!.focus()
    fireEvent.keyDown(options[1]!, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(options[2]!)
    fireEvent.keyDown(options[2]!, { key: 'Home' })
    expect(document.activeElement).toBe(options[0]!)
    fireEvent.keyDown(options[0]!, { key: 'End' })
    expect(document.activeElement).toBe(options[2]!)
    fireEvent.keyDown(options[2]!, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(options[1]!)
    expect(options.map((o) => o.tabIndex)).toEqual([-1, 0, -1])
  })

  test('a pressable item is a button', () => {
    const onClick = mock()
    render(
      <ListView>
        <ListItem title="settings" onClick={onClick} />
      </ListView>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'settings' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
