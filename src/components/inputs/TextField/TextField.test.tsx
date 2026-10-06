import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { TextField } from './TextField'

describe('TextField', () => {
  test('wires the label, description and error to the input', () => {
    render(<TextField label="email" description="we never share it" error="required" />)
    const input = screen.getByLabelText('email')
    expect(input.tagName).toBe('INPUT')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    const ids = input.getAttribute('aria-describedby')!.split(' ')
    expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual(['we never share it', 'required'])
  })

  test('uncontrolled: keeps its own text and reports changes', () => {
    const onChange = mock()
    render(<TextField aria-label="name" defaultValue="a" onChange={onChange} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('a')
    fireEvent.change(input, { target: { value: 'ab' } })
    expect(input.value).toBe('ab')
    expect(onChange.mock.calls[0]?.[0]).toBe('ab')
  })

  test('controlled: shows the given value', () => {
    function Controlled() {
      const [v, setV] = useState('x')
      return <TextField aria-label="name" value={v} onChange={(next) => setV(next.toUpperCase())} />
    }
    render(<Controlled />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'xy' } })
    expect(input.value).toBe('XY')
  })

  test('clearable: the × empties the field with a null event', () => {
    const onChange = mock()
    render(<TextField aria-label="q" defaultValue="hello" clearable onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'clear' }))
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
    expect(onChange).toHaveBeenCalledWith('', null)
    expect(screen.queryByRole('button', { name: 'clear' })).toBeNull()
  })

  test('multiline renders a textarea; prefix and suffix render inside', () => {
    render(<TextField aria-label="notes" multiline rows={4} prefix="$" suffix="kg" />)
    const area = screen.getByRole('textbox')
    expect(area.tagName).toBe('TEXTAREA')
    expect(area.getAttribute('rows')).toBe('4')
    expect(screen.getByText('$')).toBeTruthy()
    expect(screen.getByText('kg')).toBeTruthy()
  })

  test('disabled: no clear button, input disabled', () => {
    render(<TextField aria-label="q" defaultValue="x" clearable disabled />)
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
    expect(screen.queryByRole('button')).toBeNull()
  })
})
