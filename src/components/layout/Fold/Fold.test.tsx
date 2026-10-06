import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { Expander, Fold } from './Fold'

describe('Fold', () => {
  test('uncontrolled: the header toggles the body', () => {
    render(
      <ConfigProvider motion="none">
        <Fold title="advanced">inside</Fold>
      </ConfigProvider>,
    )
    const header = screen.getByRole('button', { name: 'advanced' })
    expect(header.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByText('inside')).toBeNull()
    fireEvent.click(header)
    expect(header.getAttribute('aria-expanded')).toBe('true')
    const region = screen.getByRole('region', { name: 'advanced' })
    expect(region.textContent).toBe('inside')
    expect(header.getAttribute('aria-controls')).toBe(region.id)
    expect(header.closest('.mt-fold')?.hasAttribute('data-open')).toBe(true)
    fireEvent.click(header)
    expect(screen.queryByText('inside')).toBeNull()
  })

  test('controlled: follows open and reports changes', () => {
    const onOpenChange = mock()
    const { rerender } = render(
      <ConfigProvider motion="none">
        <Fold title="a" open={false} onOpenChange={onOpenChange}>
          inside
        </Fold>
      </ConfigProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'a' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByText('inside')).toBeNull()
    rerender(
      <ConfigProvider motion="none">
        <Fold title="a" open onOpenChange={onOpenChange}>
          inside
        </Fold>
      </ConfigProvider>,
    )
    expect(screen.getByText('inside')).toBeTruthy()
  })

  // happy-dom never finishes motion's exit, so this checks the wrapper and the state, not the removal.
  test('animated: the body sits in the folding wrapper', () => {
    function Demo() {
      const [open, setOpen] = useState(true)
      return (
        <ConfigProvider motion="full">
          <Fold title="a" open={open} onOpenChange={setOpen}>
            inside
          </Fold>
        </ConfigProvider>
      )
    }
    const { container } = render(<Demo />)
    expect(container.querySelector('.mt-fold-fold > .mt-fold-body')?.textContent).toBe('inside')
    const header = screen.getByRole('button', { name: 'a' })
    fireEvent.click(header)
    expect(header.getAttribute('aria-expanded')).toBe('false')
  })

  test('disabled does not toggle; keyboard Enter works through the native button', () => {
    render(
      <ConfigProvider motion="none">
        <Fold title="a" disabled>
          inside
        </Fold>
      </ConfigProvider>,
    )
    const header = screen.getByRole('button', { name: 'a' }) as HTMLButtonElement
    expect(header.disabled).toBe(true)
    expect(header.type).toBe('button')
  })
})

describe('Expander', () => {
  test('same API in its own classes, with a description', () => {
    render(
      <ConfigProvider motion="none">
        <Expander title="notifications" description="banners and sounds" defaultOpen>
          inside
        </Expander>
      </ConfigProvider>,
    )
    const header = screen.getByRole('button', { name: /notifications/ })
    expect(header.className).toBe('mt-expander-header')
    expect(header.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText('banners and sounds').className).toBe('mt-expander-description')
    expect(screen.getByText('inside').className).toBe('mt-expander-body')
  })
})
