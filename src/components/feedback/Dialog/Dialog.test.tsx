import { describe, expect, mock, test } from 'bun:test'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { settle } from '../_overlay/testing'
import { Dialog, type DialogProps } from './Dialog'
import { useDialog, type DialogApi } from './useDialog'

function Harness(props: Partial<DialogProps> & { platform?: 'mobile' | 'desktop' }) {
  const [open, setOpen] = useState(false)
  return (
    <ConfigProvider platform={props.platform}>
      <button type="button" onClick={() => setOpen(true)}>
        open
      </button>
      <Dialog title="Delete files?" {...props} open={open} onOpenChange={setOpen}>
        They go to the recycle bin.
      </Dialog>
    </ConfigProvider>
  )
}

const dialog = () => screen.queryByRole('dialog')

describe('Dialog', () => {
  test('a labelled, described modal with actions; focus starts on the autoFocus one', async () => {
    render(<Harness actions={[{ label: 'delete', variant: 'accent', autoFocus: true }, { label: 'cancel' }]} />)
    fireEvent.click(screen.getByText('open'))
    const d = dialog()!
    expect(d.getAttribute('aria-modal')).toBe('true')
    expect(document.getElementById(d.getAttribute('aria-labelledby')!)?.textContent).toBe('Delete files?')
    expect(document.getElementById(d.getAttribute('aria-describedby')!)?.textContent).toBe('They go to the recycle bin.')
    expect(d.getAttribute('data-size')).toBe('md')
    expect(document.documentElement.style.overflow).toBe('hidden')
    await settle(50)
    expect(document.activeElement?.textContent).toBe('delete')
  })

  test('Escape closes and returns focus to the opener', async () => {
    render(<Harness />)
    const opener = screen.getByText('open')
    opener.focus()
    fireEvent.click(opener)
    await settle(50)
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    await settle()
    expect(dialog()).toBeNull()
    expect(document.activeElement).toBe(opener)
  })

  test('a press on the scrim closes it; not when dismissible is false', async () => {
    const { unmount } = render(<Harness />)
    fireEvent.click(screen.getByText('open'))
    fireEvent.pointerDown(document.querySelector('.mt-dialog-layer')!)
    await settle()
    expect(dialog()).toBeNull()
    unmount()

    render(<Harness dismissible={false} />)
    fireEvent.click(screen.getByText('open'))
    fireEvent.pointerDown(document.querySelector('.mt-dialog-layer')!)
    fireEvent.keyDown(document.body, { key: 'Escape' })
    await settle()
    expect(dialog()).toBeTruthy()
  })

  test('an action closes it unless it returns false', async () => {
    const keep = mock(() => false as const)
    const done = mock(() => {})
    render(<Harness actions={[{ label: 'keep', onClick: keep }, { label: 'done', onClick: done }]} />)
    fireEvent.click(screen.getByText('open'))
    fireEvent.click(screen.getByText('keep'))
    await settle()
    expect(dialog()).toBeTruthy()
    fireEvent.click(screen.getByText('done'))
    await settle()
    expect(done).toHaveBeenCalledTimes(1)
    expect(dialog()).toBeNull()
  })

  test('mobile: a full-screen page with a close button', async () => {
    render(<Harness platform="mobile" />)
    fireEvent.click(screen.getByText('open'))
    expect(document.querySelector('.mt-dialog-layer')?.getAttribute('data-platform')).toBe('mobile')
    expect(document.querySelector('.mt-dialog-column')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    await settle()
    expect(dialog()).toBeNull()
  })
})

describe('useDialog', () => {
  function withApi() {
    let api!: DialogApi
    function Grab() {
      api = useDialog()
      return null
    }
    render(
      <ConfigProvider>
        <Grab />
      </ConfigProvider>,
    )
    return api
  }

  test('confirm resolves true on OK and removes its layer', async () => {
    const api = withApi()
    let result: Promise<boolean>
    act(() => {
      result = api.confirm({ title: 'Sure?', content: 'really' })
    })
    expect(dialog()).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'ok' }))
    expect(await result!).toBe(true)
    await settle()
    expect(dialog()).toBeNull()
  })

  test('confirm resolves false on cancel and on Escape; danger makes an alertdialog', async () => {
    const api = withApi()
    let first: Promise<boolean>
    act(() => {
      first = api.confirm({ title: 'Sure?' })
    })
    fireEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(await first!).toBe(false)
    await settle()

    let second: Promise<boolean>
    act(() => {
      second = api.confirm({ title: 'Delete?', danger: true, okText: 'delete' })
    })
    expect(screen.getByRole('alertdialog')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'delete' }).getAttribute('data-variant')).toBe('danger')
    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(await second!).toBe(false)
  })

  test('prompt resolves the typed text on Enter, null on cancel', async () => {
    const api = withApi()
    let named: Promise<string | null>
    act(() => {
      named = api.prompt({ title: 'Rename', defaultValue: 'a' })
    })
    const input = screen.getByRole('textbox', { name: 'Rename' }) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'notes.txt' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(await named!).toBe('notes.txt')
    await settle()

    let none: Promise<string | null>
    act(() => {
      none = api.prompt({ title: 'Rename' })
    })
    fireEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(await none!).toBeNull()
  })

  test('alert resolves when dismissed', async () => {
    const api = withApi()
    let shown: Promise<void>
    act(() => {
      shown = api.alert({ title: 'Saved' })
    })
    fireEvent.click(screen.getByRole('button', { name: 'ok' }))
    expect(await shown!).toBeUndefined()
  })
})
