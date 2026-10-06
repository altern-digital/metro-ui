import { describe, expect, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { PasswordBox } from './PasswordBox'

describe('PasswordBox', () => {
  test('toggle mode reveals and hides', () => {
    render(<PasswordBox label="password" defaultValue="secret" />)
    const input = screen.getByLabelText('password') as HTMLInputElement
    expect(input.type).toBe('password')
    fireEvent.click(screen.getByRole('button', { name: 'show password' }))
    expect(input.type).toBe('text')
    const hide = screen.getByRole('button', { name: 'hide password' })
    expect(hide.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(hide)
    expect(input.type).toBe('password')
  })

  test('peek mode shows only while held, by pointer or key', () => {
    render(<PasswordBox label="password" revealMode="peek" />)
    const input = screen.getByLabelText('password') as HTMLInputElement
    const button = screen.getByRole('button', { name: 'show password' })
    fireEvent.pointerDown(button)
    expect(input.type).toBe('text')
    fireEvent.pointerUp(button)
    expect(input.type).toBe('password')
    fireEvent.keyDown(button, { key: ' ' })
    expect(input.type).toBe('text')
    fireEvent.keyUp(button, { key: ' ' })
    expect(input.type).toBe('password')
  })

  test('disabled disables the reveal button too', () => {
    render(<PasswordBox label="password" disabled />)
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true)
  })
})
