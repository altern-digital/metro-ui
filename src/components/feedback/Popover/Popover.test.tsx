import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { computePosition } from '../_overlay/position'
import { settle } from '../_overlay/testing'
import { Flyout, Popover } from './Popover'

const vp = { width: 1000, height: 800 }
const anchor = { top: 100, left: 100, width: 80, height: 32 }

describe('computePosition', () => {
  test('bottom-start sits under the anchor, aligned to its left edge', () => {
    expect(computePosition(anchor, { width: 200, height: 100 }, vp, 'bottom-start', 4)).toEqual({ top: 136, left: 100, placement: 'bottom-start' })
  })
  test('bottom-end and bottom align to the right edge and the centre', () => {
    expect(computePosition(anchor, { width: 200, height: 100 }, vp, 'bottom-end', 4).left).toBe(4)
    expect(computePosition({ ...anchor, left: 400 }, { width: 200, height: 100 }, vp, 'bottom-end', 4).left).toBe(280)
    expect(computePosition({ ...anchor, left: 400 }, { width: 200, height: 100 }, vp, 'bottom', 4).left).toBe(340)
  })
  test('flips to the top when there is no room below', () => {
    const low = { ...anchor, top: 740 }
    expect(computePosition(low, { width: 200, height: 100 }, vp, 'bottom-start', 4)).toEqual({ top: 636, left: 100, placement: 'top-start' })
  })
  test('does not flip when the other side is even smaller', () => {
    const tall = computePosition({ ...anchor, top: 20 }, { width: 200, height: 900 }, vp, 'top', 4)
    expect(tall.placement).toBe('bottom')
    expect(tall.top).toBe(4)
  })
  test('right flips left and clamps into the viewport', () => {
    const edge = { ...anchor, left: 900 }
    expect(computePosition(edge, { width: 150, height: 50 }, vp, 'right-start', 2)).toEqual({ top: 100, left: 748, placement: 'left-start' })
    expect(computePosition({ ...anchor, top: 790 }, { width: 100, height: 50 }, vp, 'right', 4).top).toBe(746)
  })
})

describe('Popover', () => {
  test('opens on click with aria wiring, closes on Escape and returns focus', async () => {
    const onOpenChange = mock()
    render(
      <ConfigProvider>
        <Popover content={<button type="button">inside</button>} onOpenChange={onOpenChange}>
          <button type="button">open</button>
        </Popover>
      </ConfigProvider>,
    )
    const trigger = screen.getByRole('button', { name: 'open' })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    trigger.focus()
    fireEvent.click(trigger)
    const panel = screen.getByRole('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id)
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'inside' }))

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(document.activeElement).toBe(trigger)
    await settle()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  test('closes on a press outside, but not on one inside', async () => {
    render(
      <ConfigProvider>
        <p>elsewhere</p>
        <Popover content="hello" defaultOpen>
          <button type="button">open</button>
        </Popover>
      </ConfigProvider>,
    )
    fireEvent.pointerDown(screen.getByRole('dialog'))
    expect(screen.getByRole('dialog')).toBeTruthy()
    fireEvent.pointerDown(screen.getByText('elsewhere'))
    await settle()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  test('clicking the trigger again toggles it shut', async () => {
    render(
      <ConfigProvider>
        <Flyout content="hello">
          <button type="button">open</button>
        </Flyout>
      </ConfigProvider>,
    )
    const trigger = screen.getByRole('button', { name: 'open' })
    fireEvent.click(trigger)
    expect(screen.getByRole('dialog').textContent).toBe('hello')
    fireEvent.pointerDown(trigger)
    fireEvent.click(trigger)
    await settle()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  test('hover trigger opens on enter and closes after leaving', async () => {
    render(
      <ConfigProvider>
        <Popover content="tip" trigger="hover">
          <button type="button">hover me</button>
        </Popover>
      </ConfigProvider>,
    )
    const trigger = screen.getByRole('button')
    fireEvent.pointerEnter(trigger)
    expect(screen.getByRole('dialog')).toBeTruthy()
    fireEvent.pointerLeave(trigger)
    await settle(150)
    await settle()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  test('manual trigger follows open only', () => {
    const { rerender } = render(
      <ConfigProvider>
        <Popover content="x" trigger="manual" open={false}>
          <button type="button">t</button>
        </Popover>
      </ConfigProvider>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(screen.queryByRole('dialog')).toBeNull()
    rerender(
      <ConfigProvider>
        <Popover content="x" trigger="manual" open>
          <button type="button">t</button>
        </Popover>
      </ConfigProvider>,
    )
    expect(screen.getByRole('dialog')).toBeTruthy()
  })
})
