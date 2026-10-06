import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { SplitView } from './SplitView'

const root = (c: HTMLElement) => c.querySelector('.mt-split-view') as HTMLElement

describe('SplitView', () => {
  test('desktop: pane and detail side by side', () => {
    const { container } = render(
      <SplitView pane="list" platform="desktop">
        detail
      </SplitView>,
    )
    expect(screen.getByText('list').className).toBe('mt-split-view-pane')
    expect(screen.getByText('detail').className).toBe('mt-split-view-detail')
    expect(root(container).style.getPropertyValue('--_pane-w')).toBe('320px')
    expect(root(container).dataset.panePosition).toBe('left')
    expect(screen.queryByRole('separator')).toBeNull()
  })

  test('collapsed hides the pane', () => {
    render(
      <SplitView pane="list" collapsed platform="desktop">
        detail
      </SplitView>,
    )
    expect(screen.queryByText('list')).toBeNull()
  })

  test('keyboard resizes within the limits (uncontrolled)', () => {
    const onChange = mock()
    const { container } = render(
      <SplitView pane="list" resizable defaultPaneWidth={300} minPaneWidth={250} maxPaneWidth={400} onPaneWidthChange={onChange} platform="desktop">
        detail
      </SplitView>,
    )
    const handle = screen.getByRole('separator', { name: 'resize pane' })
    expect(handle.getAttribute('aria-valuenow')).toBe('300')
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith(316)
    expect(root(container).style.getPropertyValue('--_pane-w')).toBe('316px')
    fireEvent.keyDown(handle, { key: 'ArrowLeft', shiftKey: true })
    expect(onChange).toHaveBeenLastCalledWith(252)
    fireEvent.keyDown(handle, { key: 'Home' })
    expect(handle.getAttribute('aria-valuenow')).toBe('250')
    fireEvent.keyDown(handle, { key: 'End' })
    expect(handle.getAttribute('aria-valuenow')).toBe('400')
  })

  test('a right pane grows as the handle moves left', () => {
    render(
      <SplitView pane="list" resizable panePosition="right" platform="desktop">
        detail
      </SplitView>,
    )
    const handle = screen.getByRole('separator')
    fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    expect(handle.getAttribute('aria-valuenow')).toBe('336')
  })

  test('pointer drag resizes', () => {
    render(
      <SplitView pane="list" resizable platform="desktop">
        detail
      </SplitView>,
    )
    const handle = screen.getByRole('separator')
    fireEvent.pointerDown(handle, { button: 0, clientX: 100, pointerId: 1 })
    fireEvent.pointerMove(handle, { clientX: 150, pointerId: 1 })
    expect(handle.getAttribute('aria-valuenow')).toBe('370')
    fireEvent.pointerUp(handle, { pointerId: 1 })
    fireEvent.pointerMove(handle, { clientX: 300, pointerId: 1 })
    expect(handle.getAttribute('aria-valuenow')).toBe('370')
  })

  test('mobile: one at a time, by showDetail', () => {
    const { rerender } = render(
      <ConfigProvider platform="mobile">
        <SplitView pane="list">detail</SplitView>
      </ConfigProvider>,
    )
    expect(screen.getByText('list')).toBeTruthy()
    expect(screen.queryByText('detail')).toBeNull()
    rerender(
      <ConfigProvider platform="mobile">
        <SplitView pane="list" showDetail>
          detail
        </SplitView>
      </ConfigProvider>,
    )
    expect(screen.queryByText('list')).toBeNull()
    expect(screen.getByText('detail')).toBeTruthy()
  })
})
