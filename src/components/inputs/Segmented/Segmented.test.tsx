import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { Segmented } from './Segmented'

const options = [
  { value: 'day', label: 'day' },
  { value: 'week', label: 'week', disabled: true },
  { value: 'month', label: 'month' },
]

describe('Segmented', () => {
  test('a radiogroup of radios, the picked one checked and tabbable', () => {
    render(<Segmented aria-label="range" options={options} defaultValue="month" size="sm" block />)
    const group = screen.getByRole('radiogroup', { name: 'range' })
    expect(group.dataset.size).toBe('sm')
    expect(group.hasAttribute('data-block')).toBe(true)
    const month = screen.getByRole('radio', { name: 'month' })
    expect(month.getAttribute('aria-checked')).toBe('true')
    expect(month.tabIndex).toBe(0)
    expect(screen.getByRole('radio', { name: 'day' }).tabIndex).toBe(-1)
  })

  test('uncontrolled: click picks', () => {
    const onChange = mock()
    render(<Segmented options={options} onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'month' }))
    expect(onChange).toHaveBeenCalledWith('month')
    expect(screen.getByRole('radio', { name: 'month' }).getAttribute('aria-checked')).toBe('true')
  })

  test('controlled: the value decides', () => {
    const onChange = mock()
    render(<Segmented options={options} value="day" onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'month' }))
    expect(onChange).toHaveBeenCalledWith('month')
    expect(screen.getByRole('radio', { name: 'day' }).getAttribute('aria-checked')).toBe('true')
  })

  test('arrow keys move and pick, skipping disabled; Home/End jump', () => {
    const onChange = mock()
    render(<Segmented options={options} defaultValue="day" onChange={onChange} />)
    const day = screen.getByRole('radio', { name: 'day' })
    fireEvent.keyDown(day, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith('month')
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'month' }))
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith('day')
    fireEvent.keyDown(document.activeElement!, { key: 'End' })
    expect(onChange).toHaveBeenLastCalledWith('month')
    fireEvent.keyDown(document.activeElement!, { key: 'Home' })
    expect(onChange).toHaveBeenLastCalledWith('day')
  })

  test('disabled disables every segment', () => {
    render(<Segmented options={options} disabled />)
    for (const r of screen.getAllByRole('radio')) expect((r as HTMLButtonElement).disabled).toBe(true)
  })
})
