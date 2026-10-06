import { describe, expect, mock, test } from 'bun:test'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { settle } from '../_overlay/testing'
import { useToast, type ToastApi } from './Toast'

function withApi(platform?: 'mobile' | 'desktop') {
  let api!: ToastApi
  function Grab() {
    api = useToast()
    return null
  }
  render(
    <ConfigProvider platform={platform}>
      <Grab />
    </ConfigProvider>,
  )
  return api
}

const toasts = () => document.querySelectorAll('.mt-toast')

describe('useToast', () => {
  test('show mounts one polite region and returns an id; dismiss removes it', async () => {
    const api = withApi()
    let id = ''
    act(() => {
      id = api.show({ title: 'saved', description: 'all changes are in' })
    })
    const region = screen.getByRole('region', { name: 'notifications' })
    expect(region.getAttribute('aria-live')).toBe('polite')
    expect(region.textContent).toContain('saved')
    expect(region.textContent).toContain('all changes are in')
    act(() => {
      api.info('second')
    })
    expect(toasts()).toHaveLength(2)
    expect(screen.getAllByRole('region')).toHaveLength(1)
    act(() => api.dismiss(id))
    await settle()
    expect(toasts()).toHaveLength(1)
    act(() => api.dismissAll())
    await settle()
    expect(toasts()).toHaveLength(0)
  })

  test('tones set the bar and glyph; the close button dismisses', async () => {
    const api = withApi()
    act(() => {
      api.error('failed')
    })
    const toast = toasts()[0]!
    expect(toast.getAttribute('data-tone')).toBe('error')
    expect(toast.querySelector('.mt-toast-icon svg')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    await settle()
    expect(toasts()).toHaveLength(0)
  })

  test('goes after its duration, but not while hovered; 0 is sticky', async () => {
    const api = withApi()
    act(() => {
      api.show({ title: 'quick', duration: 60 })
      api.show({ title: 'sticky', duration: 0 })
      api.show({ title: 'held', duration: 60 })
    })
    fireEvent.pointerEnter(screen.getByText('held').closest('.mt-toast')!, { pointerType: 'mouse' })
    await settle(100)
    await settle()
    expect([...toasts()].map((t) => t.querySelector('.mt-toast-title')?.textContent)).toEqual(['sticky', 'held'])
    fireEvent.pointerLeave(screen.getByText('held').closest('.mt-toast')!, { pointerType: 'mouse' })
    await settle(100)
    await settle()
    expect(toasts()).toHaveLength(1)
  })

  test('the action runs and dismisses; reusing an id replaces in place', async () => {
    const onClick = mock(() => {})
    const api = withApi()
    act(() => {
      api.show({ id: 'up', title: 'uploading…', duration: 0 })
    })
    act(() => {
      api.success({ id: 'up', title: 'uploaded', action: { label: 'open', onClick } })
    })
    expect(toasts()).toHaveLength(1)
    expect(screen.getByText('uploaded')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    await settle()
    expect(toasts()).toHaveLength(0)
  })

  test('mobile: banners in a mobile region', () => {
    const api = withApi('mobile')
    act(() => {
      api.warning({ title: 'offline' })
    })
    expect(screen.getByRole('region').getAttribute('data-platform')).toBe('mobile')
    expect(toasts()).toHaveLength(1)
  })
})
