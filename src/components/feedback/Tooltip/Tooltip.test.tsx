import { describe, expect, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { ConfigContext, DEFAULT_CONFIG } from '../../../config/context'
import { settle } from '../_overlay/testing'
import { Tooltip } from './Tooltip'

function setup(delay = 20) {
  render(
    <ConfigProvider>
      <Tooltip content="refresh the list" delay={delay}>
        <button type="button">refresh</button>
      </Tooltip>
    </ConfigProvider>,
  )
  return screen.getByRole('button')
}

describe('Tooltip', () => {
  test('shows after the delay on hover and describes the trigger', async () => {
    const trigger = setup()
    fireEvent.pointerEnter(trigger)
    expect(screen.queryByRole('tooltip')).toBeNull()
    await settle(40)
    const tip = screen.getByRole('tooltip')
    expect(tip.textContent).toBe('refresh the list')
    expect(trigger.getAttribute('aria-describedby')).toBe(tip.id)
    fireEvent.pointerLeave(trigger)
    await settle()
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(trigger.getAttribute('aria-describedby')).toBeNull()
  })

  test('shows on focus and hides on Escape', async () => {
    const trigger = setup()
    fireEvent.focus(trigger)
    await settle(40)
    expect(screen.getByRole('tooltip')).toBeTruthy()
    fireEvent.keyDown(trigger, { key: 'Escape' })
    await settle()
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  test('leaving before the delay never shows it', async () => {
    const trigger = setup(100)
    fireEvent.pointerEnter(trigger)
    fireEvent.pointerLeave(trigger)
    await settle(150)
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  test('a coarse pointer renders only the child', async () => {
    render(
      <ConfigContext value={{ ...DEFAULT_CONFIG, coarse: true }}>
        <Tooltip content="tip" delay={0}>
          <button type="button">tap</button>
        </Tooltip>
      </ConfigContext>,
    )
    const trigger = screen.getByRole('button')
    fireEvent.pointerEnter(trigger)
    fireEvent.focus(trigger)
    await settle(20)
    expect(screen.queryByRole('tooltip')).toBeNull()
  })
})
