import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { Slider } from './Slider'

describe('Slider', () => {
  test('a slider with its range and value', () => {
    render(<Slider aria-label="volume" min={10} max={20} step={2} defaultValue={14} />)
    const slider = screen.getByRole('slider', { name: 'volume' }) as HTMLInputElement
    expect(slider.min).toBe('10')
    expect(slider.max).toBe('20')
    expect(slider.step).toBe('2')
    expect(slider.value).toBe('14')
  })

  test('uncontrolled: changes and reports, and the fill follows', () => {
    const onChange = mock()
    const { container } = render(<Slider aria-label="v" defaultValue={0} onChange={onChange} />)
    fireEvent.change(screen.getByRole('slider'), { target: { value: '25' } })
    expect(onChange).toHaveBeenCalledWith(25)
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--_p')).toBe('0.25')
  })

  test('controlled: stays on its value', () => {
    const onChange = mock()
    render(<Slider aria-label="v" value={50} onChange={onChange} />)
    const slider = screen.getByRole('slider') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '60' } })
    expect(onChange).toHaveBeenCalledWith(60)
    expect(slider.value).toBe('50')
  })

  test('onChangeEnd on pointer up and on navigation keys', () => {
    const onChangeEnd = mock()
    render(<Slider aria-label="v" defaultValue={30} onChangeEnd={onChangeEnd} />)
    const slider = screen.getByRole('slider')
    fireEvent.pointerUp(slider)
    fireEvent.keyUp(slider, { key: 'ArrowRight' })
    fireEvent.keyUp(slider, { key: 'a' })
    expect(onChangeEnd).toHaveBeenCalledTimes(2)
    expect(onChangeEnd).toHaveBeenLastCalledWith(30)
  })

  test('formatValue feeds the tooltip and aria-valuetext', () => {
    render(<Slider aria-label="v" defaultValue={40} tooltip formatValue={(v) => `${v}%`} />)
    expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toBe('40%')
    expect(screen.getByText('40%')).toBeTruthy()
  })

  test('disabled', () => {
    render(<Slider aria-label="v" disabled />)
    expect((screen.getByRole('slider') as HTMLInputElement).disabled).toBe(true)
  })
})
