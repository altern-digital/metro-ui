import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  test('uncontrolled: toggles by clicking its label', () => {
    const onChange = mock()
    render(<Checkbox label="remember me" onChange={onChange} />)
    const box = screen.getByRole('checkbox', { name: 'remember me' }) as HTMLInputElement
    expect(box.checked).toBe(false)
    fireEvent.click(screen.getByText('remember me'))
    expect(box.checked).toBe(true)
    expect(onChange.mock.calls[0]?.[0]).toBe(true)
  })

  test('controlled: follows checked', () => {
    const onChange = mock()
    render(<Checkbox label="a" checked={false} onChange={onChange} />)
    const box = screen.getByRole('checkbox') as HTMLInputElement
    fireEvent.click(box)
    expect(onChange.mock.calls[0]?.[0]).toBe(true)
    expect(box.checked).toBe(false)
  })

  test('indeterminate sets the native flag', () => {
    render(<Checkbox label="all" indeterminate />)
    expect((screen.getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true)
  })

  test('description is wired with aria-describedby', () => {
    render(<Checkbox label="terms" description="you must agree" />)
    expect(screen.getByRole('checkbox', { name: 'terms' })).toBeTruthy()
    const id = screen.getByRole('checkbox').getAttribute('aria-describedby')!
    expect(document.getElementById(id)?.textContent).toBe('you must agree')
  })

  test('disabled does not toggle', () => {
    render(<Checkbox label="off" disabled />)
    const box = screen.getByRole('checkbox') as HTMLInputElement
    expect(box.disabled).toBe(true)
    fireEvent.click(screen.getByText('off'))
    expect(box.checked).toBe(false)
  })

  test('the native input takes keyboard focus', () => {
    render(<Checkbox label="k" />)
    const box = screen.getByRole('checkbox') as HTMLInputElement
    box.focus()
    expect(document.activeElement).toBe(box)
  })
})
