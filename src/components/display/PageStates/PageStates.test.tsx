import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { PageStates } from './PageStates'

describe('PageStates', () => {
  test('ready shows the children', () => {
    render(<PageStates state="ready">content</PageStates>)
    expect(screen.getByText('content')).toBeTruthy()
  })

  test('loading: a ring and the locale text', () => {
    const { container } = render(<PageStates state="loading">content</PageStates>)
    expect(screen.getByRole('status').textContent).toBe('loading…')
    expect(container.querySelector('.mt-progress-ring')).toBeTruthy()
    expect(screen.queryByText('content')).toBeNull()
  })

  test('empty: the locale text, a custom title, or an element', () => {
    const { rerender } = render(<PageStates state="empty" />)
    expect(screen.getByText('nothing here yet').className).toBe('mt-empty-state-title')
    rerender(<PageStates state="empty" empty="no projects" />)
    expect(screen.getByText('no projects')).toBeTruthy()
    rerender(<PageStates state="empty" empty={<p>custom</p>} />)
    expect(screen.getByText('custom').tagName).toBe('P')
  })

  test('error: message, retry from the locale', () => {
    const onRetry = mock()
    render(
      <ConfigProvider locale={{ error: 'terjadi kesalahan', retry: 'coba lagi' }}>
        <PageStates state="error" error={new Error('timed out')} onRetry={onRetry} />
      </ConfigProvider>,
    )
    const alert = screen.getByRole('alert')
    expect(alert.textContent).toContain('terjadi kesalahan')
    expect(alert.textContent).toContain('timed out')
    fireEvent.click(screen.getByRole('button', { name: 'coba lagi' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  test('error without onRetry has no button', () => {
    render(<PageStates state="error" />)
    expect(screen.queryByRole('button')).toBeNull()
  })
})
