import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { DatePicker, Picker, TimePicker } from './Picker'

const sizes = {
  key: 'size',
  label: 'size',
  options: [
    { value: 's', label: 'small' },
    { value: 'm', label: 'medium' },
    { value: 'l', label: 'large' },
  ],
}

describe('Picker', () => {
  test('each column is a spin button saying its value', () => {
    render(<Picker columns={[sizes]} defaultValue={{ size: 'm' }} />)
    const col = screen.getByRole('spinbutton', { name: 'size' })
    expect(col.getAttribute('aria-valuenow')).toBe('1')
    expect(col.getAttribute('aria-valuetext')).toBe('medium')
    expect(col.getAttribute('aria-valuemax')).toBe('2')
  })

  test('arrow keys move; without loop they stop at the ends', () => {
    const onChange = mock()
    render(<Picker columns={[sizes]} defaultValue={{ size: 'm' }} onChange={onChange} />)
    const col = screen.getByRole('spinbutton')
    fireEvent.keyDown(col, { key: 'ArrowDown' })
    expect(onChange).toHaveBeenLastCalledWith({ size: 'l' }, 'size')
    fireEvent.keyDown(col, { key: 'ArrowDown' })
    expect(onChange).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(col, { key: 'Home' })
    expect(onChange).toHaveBeenLastCalledWith({ size: 's' }, 'size')
  })

  test('loop wraps around and renders the list three times', () => {
    const onChange = mock()
    const { container } = render(<Picker loop columns={[sizes]} defaultValue={{ size: 'l' }} onChange={onChange} />)
    expect(container.querySelectorAll('.mt-picker-row')).toHaveLength(9)
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'ArrowDown' })
    expect(onChange).toHaveBeenLastCalledWith({ size: 's' }, 'size')
  })

  test('controlled: the value decides; a row click picks', () => {
    const onChange = mock()
    render(<Picker columns={[sizes]} value={{ size: 's' }} onChange={onChange} />)
    fireEvent.click(screen.getByText('large'))
    expect(onChange).toHaveBeenLastCalledWith({ size: 'l' }, 'size')
    expect(screen.getByRole('spinbutton').getAttribute('aria-valuetext')).toBe('small')
  })

  test('disabled ignores keys and leaves the tab order', () => {
    const onChange = mock()
    render(<Picker columns={[sizes]} disabled onChange={onChange} />)
    const col = screen.getByRole('spinbutton')
    expect(col.tabIndex).toBe(-1)
    expect(col.getAttribute('aria-disabled')).toBe('true')
    fireEvent.keyDown(col, { key: 'ArrowDown' })
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('DatePicker', () => {
  test('day, month and year columns; clamps the day to the month', () => {
    const onChange = mock()
    render(<DatePicker defaultValue={new Date(2024, 0, 31)} onChange={onChange} />)
    expect(screen.getByRole('spinbutton', { name: 'month' }).getAttribute('aria-valuetext')).toBe('January')
    fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'month' }), { key: 'ArrowDown' })
    const date = onChange.mock.calls[0]?.[0] as Date
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2024, 1, 29])
    expect(screen.getByRole('spinbutton', { name: 'day' }).getAttribute('aria-valuemax')).toBe('28')
  })
})

describe('TimePicker', () => {
  test('24-hour by default', () => {
    const onChange = mock()
    render(<TimePicker defaultValue="23:45" minuteStep={15} onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'hour' }), { key: 'ArrowDown' })
    expect(onChange).toHaveBeenLastCalledWith('00:45')
  })

  test('12-hour with am/pm', () => {
    const onChange = mock()
    render(<TimePicker use12Hours defaultValue="13:05" onChange={onChange} />)
    expect(screen.getByRole('spinbutton', { name: 'hour' }).getAttribute('aria-valuetext')).toBe('1')
    fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'am/pm' }), { key: 'ArrowUp' })
    expect(onChange).toHaveBeenLastCalledWith('01:05')
  })
})
