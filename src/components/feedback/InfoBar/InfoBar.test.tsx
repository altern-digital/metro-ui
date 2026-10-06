import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { InfoBar } from './InfoBar'

describe('InfoBar', () => {
  test('renders title, message and a severity glyph as a status', () => {
    render(<InfoBar title="saved" message="your changes are in." />)
    const bar = screen.getByRole('status')
    expect(bar.getAttribute('data-severity')).toBe('info')
    expect(bar.getAttribute('data-appearance')).toBe('bar')
    expect(bar.textContent).toBe('savedyour changes are in.')
    expect(bar.querySelector('.mt-info-bar-icon svg')).toBeTruthy()
  })

  test('errors and warnings are alerts', () => {
    render(
      <>
        <InfoBar severity="error" message="failed" />
        <InfoBar severity="warning" message="careful" />
        <InfoBar severity="success" message="done" />
      </>,
    )
    expect(screen.getAllByRole('alert')).toHaveLength(2)
    expect(screen.getByRole('status').textContent).toBe('done')
  })

  test('closable shows a labelled close button', () => {
    const onClose = mock(() => {})
    render(<InfoBar message="x" closable onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('icon={false} hides the glyph; action and fill render', () => {
    render(<InfoBar message="x" icon={false} appearance="fill" action={<button type="button">undo</button>} />)
    const bar = screen.getByRole('status')
    expect(bar.querySelector('.mt-info-bar-icon')).toBeNull()
    expect(bar.getAttribute('data-appearance')).toBe('fill')
    expect(screen.getByRole('button', { name: 'undo' })).toBeTruthy()
  })
})
