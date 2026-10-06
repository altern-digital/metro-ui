import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ToggleSwitch } from './ToggleSwitch'

describe('ToggleSwitch', () => {
  test('a switch named by its label, saying on/off', () => {
    const onChange = mock()
    render(<ToggleSwitch label="wi-fi" onChange={onChange} />)
    const sw = screen.getByRole('switch', { name: 'wi-fi' })
    expect(sw.getAttribute('aria-checked')).toBe('false')
    expect(screen.getByText('off')).toBeTruthy()
    fireEvent.click(sw)
    expect(sw.getAttribute('aria-checked')).toBe('true')
    expect(screen.getByText('on')).toBeTruthy()
    expect(onChange.mock.calls[0]?.[0]).toBe(true)
  })

  test('controlled, with custom state labels', () => {
    const onChange = mock()
    render(<ToggleSwitch label="sync" checked onLabel="yes" offLabel="no" onChange={onChange} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange.mock.calls[0]?.[0]).toBe(false)
    expect(screen.getByText('yes')).toBeTruthy()
  })

  test('disabled does not toggle', () => {
    render(<ToggleSwitch label="bluetooth" disabled />)
    const sw = screen.getByRole('switch') as HTMLInputElement
    expect(sw.disabled).toBe(true)
    fireEvent.click(screen.getByText('bluetooth'))
    expect(sw.checked).toBe(false)
  })
})
