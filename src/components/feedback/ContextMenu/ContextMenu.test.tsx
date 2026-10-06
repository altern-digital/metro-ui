import { describe, expect, mock, test } from 'bun:test'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { settle } from '../_overlay/testing'
import { ContextMenu } from './ContextMenu'

function setup(platform?: 'mobile' | 'desktop', onSelect = mock(() => {}), onClick = mock(() => {})) {
  render(
    <ConfigProvider platform={platform}>
      <ContextMenu items={[{ key: 'pin', label: 'pin to start', onSelect }, { key: 'rm', label: 'uninstall', danger: true }]}>
        <div tabIndex={0} onClick={onClick}>
          area
        </div>
      </ContextMenu>
    </ConfigProvider>,
  )
  return screen.getByText('area')
}

describe('ContextMenu', () => {
  test('right-click opens a menu at the pointer and blocks the browser menu', () => {
    const area = setup()
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 120, clientY: 80 })
    act(() => {
      area.dispatchEvent(event)
    })
    expect(event.defaultPrevented).toBe(true)
    expect(screen.getByRole('menu')).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: 'uninstall' }).hasAttribute('data-danger')).toBe(true)
  })

  test('selecting runs the item and closes; Escape closes', async () => {
    const onSelect = mock(() => {})
    const area = setup(undefined, onSelect)
    fireEvent.contextMenu(area, { clientX: 10, clientY: 10 })
    fireEvent.click(screen.getByRole('menuitem', { name: 'pin to start' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
    await settle()
    expect(screen.queryByRole('menu')).toBeNull()

    fireEvent.contextMenu(area, { clientX: 10, clientY: 10 })
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    await settle()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  test('a 500ms touch long-press opens it and swallows the following click', async () => {
    const onClick = mock(() => {})
    const area = setup(undefined, undefined, onClick)
    fireEvent.pointerDown(area, { pointerType: 'touch', clientX: 50, clientY: 50 })
    await settle(550)
    expect(screen.getByRole('menu')).toBeTruthy()
    fireEvent.pointerUp(area, { pointerType: 'touch' })
    fireEvent.click(area)
    expect(onClick).not.toHaveBeenCalled()
  })

  test('moving the finger more than 10px cancels the long-press', async () => {
    const area = setup()
    fireEvent.pointerDown(area, { pointerType: 'touch', clientX: 50, clientY: 50 })
    fireEvent.pointerMove(area, { pointerType: 'touch', clientX: 50, clientY: 70 })
    await settle(550)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  test('mobile: a bottom sheet instead of a popup', () => {
    const area = setup('mobile')
    fireEvent.contextMenu(area, { clientX: 10, clientY: 10 })
    expect(document.querySelector('.mt-bottom-sheet')).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: 'pin to start' })).toBeTruthy()
  })
})
