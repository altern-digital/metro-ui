import { describe, expect, mock, test } from 'bun:test'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { PullToRefresh } from './PullToRefresh'

const touch = { pointerType: 'touch', isPrimary: true, pointerId: 1 }

describe('PullToRefresh', () => {
  test('renders the content and an idle status', () => {
    const { container } = render(
      <PullToRefresh onRefresh={() => {}}>
        <p>list</p>
      </PullToRefresh>,
    )
    const root = container.querySelector<HTMLElement>('.mt-pull-to-refresh')!
    expect(root.dataset.phase).toBe('idle')
    expect(root.dataset.target).toBe('self')
    expect(screen.getByText('list')).toBeTruthy()
    expect(screen.getByRole('status').textContent).toBe('')
    expect(screen.getByText('pull to refresh')).toBeTruthy()
  })

  test('a touch pull past the threshold refreshes', async () => {
    let finish = () => {}
    const onRefresh = mock(() => new Promise<void>((r) => (finish = r)))
    const { container } = render(
      <ConfigProvider motion="none">
        <PullToRefresh onRefresh={onRefresh} releaseLabel="let go">
          <p>list</p>
        </PullToRefresh>
      </ConfigProvider>,
    )
    const root = container.querySelector<HTMLElement>('.mt-pull-to-refresh')!
    fireEvent.pointerDown(root, { ...touch, clientY: 0 })
    fireEvent.pointerMove(root, { ...touch, clientY: 400 })
    expect(root.dataset.phase).toBe('armed')
    expect(screen.getByText('let go')).toBeTruthy()
    fireEvent.pointerUp(root, { ...touch, clientY: 400 })
    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(root.dataset.phase).toBe('refreshing')
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(screen.getByRole('status').textContent).toBe('loading…')
    await act(async () => finish())
    await waitFor(() => expect(root.dataset.phase).toBe('idle'))
  })

  test('a short pull, a mouse, or disabled do nothing', () => {
    const onRefresh = mock()
    const { container, rerender } = render(<PullToRefresh onRefresh={onRefresh} />)
    const root = container.querySelector<HTMLElement>('.mt-pull-to-refresh')!
    fireEvent.pointerDown(root, { ...touch, clientY: 0 })
    fireEvent.pointerMove(root, { ...touch, clientY: 30 })
    fireEvent.pointerUp(root, { ...touch, clientY: 30 })
    fireEvent.pointerDown(root, { pointerType: 'mouse', isPrimary: true, pointerId: 2, clientY: 0 })
    fireEvent.pointerMove(root, { pointerType: 'mouse', isPrimary: true, pointerId: 2, clientY: 400 })
    fireEvent.pointerUp(root, { pointerType: 'mouse', isPrimary: true, pointerId: 2, clientY: 400 })
    rerender(<PullToRefresh onRefresh={onRefresh} disabled />)
    fireEvent.pointerDown(root, { ...touch, clientY: 0 })
    fireEvent.pointerMove(root, { ...touch, clientY: 400 })
    fireEvent.pointerUp(root, { ...touch, clientY: 400 })
    expect(onRefresh).not.toHaveBeenCalled()
    expect(root.dataset.phase).toBe('idle')
  })
})
