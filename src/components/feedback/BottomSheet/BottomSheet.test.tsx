import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { settle } from '../_overlay/testing'
import { BottomSheet, type BottomSheetProps } from './BottomSheet'

function Harness(props: Partial<BottomSheetProps> & { onChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <ConfigProvider>
      <button type="button" onClick={() => setOpen(true)}>
        share
      </button>
      <BottomSheet
        title="share to"
        {...props}
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          props.onChange?.(next)
        }}
      >
        <button type="button">mail</button>
      </BottomSheet>
    </ConfigProvider>
  )
}

const sheet = () => screen.queryByRole('dialog')

describe('BottomSheet', () => {
  test('opens as a labelled modal dialog with a drag handle', async () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('share'))
    const dialog = sheet()!
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)?.textContent).toBe('share to')
    expect(dialog.querySelector('.mt-bottom-sheet-handle')).toBeTruthy()
    expect(document.documentElement.style.overflow).toBe('hidden')
    await settle()
  })

  test('Escape closes it and returns focus to the opener', async () => {
    const onChange = mock(() => {})
    render(<Harness onChange={onChange} />)
    const opener = screen.getByText('share')
    opener.focus()
    fireEvent.click(opener)
    await settle(50)
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' })
    expect(onChange).toHaveBeenCalledWith(false)
    await settle()
    expect(sheet()).toBeNull()
    expect(document.activeElement).toBe(opener)
    expect(document.documentElement.style.overflow).toBe('')
  })

  test('a click on the scrim closes it', async () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('share'))
    fireEvent.click(document.querySelector('.mt-bottom-sheet-scrim')!)
    await settle()
    expect(sheet()).toBeNull()
  })

  test('dismissible={false} ignores the scrim and Escape', async () => {
    render(<Harness dismissible={false} />)
    fireEvent.click(screen.getByText('share'))
    fireEvent.click(document.querySelector('.mt-bottom-sheet-scrim')!)
    fireEvent.keyDown(document.body, { key: 'Escape' })
    await settle()
    expect(sheet()).toBeTruthy()
  })

  test('renders a footer and traps focus inside', async () => {
    render(<Harness footer={<button type="button">done</button>} />)
    fireEvent.click(screen.getByText('share'))
    await settle(50)
    expect(screen.getByText('done').closest('.mt-bottom-sheet-footer')).toBeTruthy()
    expect(sheet()!.contains(document.activeElement)).toBe(true)
  })
})
