import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { settle } from '../_overlay/testing'
import { MenuFlyout, type MenuItem } from './MenuFlyout'

const make = (onSelect = mock(() => {})): MenuItem[] => [
  { key: 'cut', label: 'Cut', shortcut: 'Ctrl+X', onSelect },
  { key: 'copy', label: 'Copy', onSelect },
  { key: 'gone', label: 'Delete', disabled: true },
  { key: 'd1', divider: true },
  { key: 'wrap', label: 'Word wrap', checked: true },
  {
    key: 'more',
    label: 'More',
    items: [
      { key: 'a', label: 'Alpha', onSelect },
      { key: 'b', label: 'Beta' },
    ],
  },
]

function setup(items = make(), platform?: 'mobile' | 'desktop') {
  render(
    <ConfigProvider platform={platform}>
      <MenuFlyout items={items}>
        <button type="button">edit</button>
      </MenuFlyout>
      <p>outside</p>
    </ConfigProvider>,
  )
  return screen.getByRole('button', { name: 'edit' })
}

describe('MenuFlyout', () => {
  test('a click opens a menu with aria wiring and the item roles', () => {
    const trigger = setup()
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(trigger, { detail: 1 })
    const menu = screen.getByRole('menu')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id)
    expect(screen.getAllByRole('menuitem').map((el) => el.textContent)).toEqual(['CutCtrl+X', 'Copy', 'Delete', 'More'])
    expect(screen.getByRole('menuitemcheckbox').getAttribute('aria-checked')).toBe('true')
    expect(screen.getByRole('menuitem', { name: 'Delete' }).getAttribute('aria-disabled')).toBe('true')
    expect(screen.getByRole('separator')).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: 'More' }).getAttribute('aria-haspopup')).toBe('menu')
  })

  test('ArrowDown opens on the first item; arrows, Home and End skip disabled ones', () => {
    const trigger = setup()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    const items = () => document.activeElement?.textContent
    expect(items()).toBe('CutCtrl+X')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(items()).toBe('Copy')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(items()).toBe('Word wrap')
    fireEvent.keyDown(document.activeElement!, { key: 'End' })
    expect(items()).toBe('More')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(items()).toBe('CutCtrl+X')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
    expect(items()).toBe('More')
    fireEvent.keyDown(document.activeElement!, { key: 'Home' })
    expect(items()).toBe('CutCtrl+X')
  })

  test('typeahead jumps to the next item starting with the letter', () => {
    const trigger = setup()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(document.activeElement!, { key: 'w' })
    expect(document.activeElement?.textContent).toBe('Word wrap')
  })

  test('Enter selects, closes and returns focus to the trigger', async () => {
    const onSelect = mock(() => {})
    const trigger = setup(make(onSelect))
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    fireEvent.click(document.activeElement!)
    expect(onSelect).toHaveBeenCalledTimes(1)
    await settle()
    expect(screen.queryByRole('menu')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  test('a disabled item does nothing', () => {
    const trigger = setup()
    fireEvent.click(trigger, { detail: 1 })
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))
    expect(screen.getByRole('menu')).toBeTruthy()
  })

  test('Escape closes and gives focus back', async () => {
    const trigger = setup()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    await settle()
    expect(screen.queryByRole('menu')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  test('a press outside closes it', async () => {
    const trigger = setup()
    fireEvent.click(trigger, { detail: 1 })
    fireEvent.pointerDown(screen.getByText('outside'))
    await settle()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  test('ArrowRight opens a submenu, ArrowLeft and Escape close only it', async () => {
    const onSelect = mock(() => {})
    const trigger = setup(make(onSelect))
    fireEvent.keyDown(trigger, { key: 'ArrowUp' })
    expect(document.activeElement?.textContent).toBe('More')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' })
    expect(screen.getAllByRole('menu')).toHaveLength(2)
    expect(document.activeElement?.textContent).toBe('Alpha')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' })
    await settle()
    expect(screen.getAllByRole('menu')).toHaveLength(1)
    expect(document.activeElement?.textContent).toBe('More')

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' })
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    await settle()
    expect(screen.getAllByRole('menu')).toHaveLength(1)

    // Choosing in a submenu closes the whole menu.
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' })
    fireEvent.click(document.activeElement!)
    expect(onSelect).toHaveBeenCalledTimes(1)
    await settle()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  test('mobile: a bottom sheet of rows that drills into submenus', async () => {
    const onSelect = mock(() => {})
    const trigger = setup(make(onSelect), 'mobile')
    fireEvent.click(trigger)
    expect(document.querySelector('.mt-bottom-sheet')).toBeTruthy()
    expect(document.querySelector('.mt-floating')).toBeNull()
    fireEvent.click(screen.getByRole('menuitem', { name: 'More' }))
    expect(screen.getByRole('menuitem', { name: 'Alpha' })).toBeTruthy()
    fireEvent.click(screen.getByRole('menuitem', { name: 'back' }))
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeTruthy()
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
    await settle()
    expect(document.querySelector('.mt-bottom-sheet')).toBeNull()
  })
})
