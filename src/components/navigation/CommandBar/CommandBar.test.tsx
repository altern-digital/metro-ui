import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { CommandBar, type CommandItem } from './CommandBar'

const make = (onClick = mock()) => {
  const primary: CommandItem[] = [
    { key: 'add', label: 'add', icon: <svg />, onClick },
    { key: 'pin', label: 'pin', icon: <svg />, toggled: true },
  ]
  const secondary: CommandItem[] = [{ key: 'settings', label: 'settings', onClick }]
  return { primary, secondary, onClick }
}

describe('CommandBar', () => {
  test('desktop: a toolbar of labelled buttons and a more menu', async () => {
    const { primary, secondary, onClick } = make()
    render(<CommandBar primary={primary} secondary={secondary} content={<b>inbox</b>} platform="desktop" />)
    const bar = screen.getByRole('toolbar')
    expect(bar.dataset.platform).toBe('desktop')
    expect(bar.dataset.labels).toBe('right')
    expect(screen.getByText('inbox')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'add' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'pin' }).getAttribute('aria-pressed')).toBe('true')
    const more = screen.getByRole('button', { name: 'more' })
    expect(more.getAttribute('aria-haspopup')).toBe('menu')
    fireEvent.click(more)
    const item = await screen.findByRole('menuitem', { name: /settings/ })
    fireEvent.click(item)
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  test('collapsed labels name the buttons', () => {
    render(<CommandBar primary={make().primary} labels="collapsed" platform="desktop" />)
    expect(screen.getByRole('button', { name: 'add' }).getAttribute('aria-label')).toBe('add')
  })

  test('mobile: round icons; more lifts the bar to show the rest', () => {
    const { primary, secondary, onClick } = make()
    render(
      <ConfigProvider platform="mobile">
        <CommandBar primary={primary} secondary={secondary} position="absolute" />
      </ConfigProvider>,
    )
    const bar = screen.getByRole('toolbar')
    expect(bar.dataset.platform).toBe('mobile')
    expect(bar.dataset.position).toBe('absolute')
    expect(screen.getByRole('button', { name: 'add' }).getAttribute('aria-label')).toBe('add')
    const more = screen.getByRole('button', { name: 'more' })
    expect(more.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(more)
    expect(bar.dataset.open).toBe('')
    expect(screen.getByRole('button', { name: 'add' }).hasAttribute('aria-label')).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'settings' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(more.getAttribute('aria-expanded')).toBe('false')
    expect(bar.hasAttribute('data-open')).toBe(false)
  })

  test('mobile: Escape closes; controlled open', () => {
    const onOpenChange = mock()
    const { rerender } = render(<CommandBar primary={make().primary} secondary={make().secondary} platform="mobile" defaultOpen onOpenChange={onOpenChange} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onOpenChange).toHaveBeenCalledWith(false)
    rerender(<CommandBar primary={make().primary} secondary={make().secondary} platform="mobile" open onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'more' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(screen.getByRole('toolbar').dataset.open).toBe('')
  })
})
