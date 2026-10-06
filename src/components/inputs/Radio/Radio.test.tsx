import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { Radio, RadioGroup } from './Radio'

const options = [
  { value: 'dark', label: 'dark' },
  { value: 'light', label: 'light' },
  { value: 'system', label: 'system', disabled: true },
]

describe('RadioGroup', () => {
  test('a labelled radiogroup whose radios share a name', () => {
    render(<RadioGroup label="theme" options={options} name="theme" orientation="horizontal" />)
    const group = screen.getByRole('radiogroup', { name: 'theme' })
    expect(group.dataset.orientation).toBe('horizontal')
    const radios = screen.getAllByRole('radio') as HTMLInputElement[]
    expect(radios.map((r) => r.name)).toEqual(['theme', 'theme', 'theme'])
    expect(radios[2]!.disabled).toBe(true)
  })

  test('uncontrolled: picks and reports the value', () => {
    const onChange = mock()
    render(<RadioGroup label="theme" options={options} defaultValue="dark" onChange={onChange} />)
    expect((screen.getByRole('radio', { name: 'dark' }) as HTMLInputElement).checked).toBe(true)
    fireEvent.click(screen.getByRole('radio', { name: 'light' }))
    expect(onChange).toHaveBeenCalledWith('light')
    expect((screen.getByRole('radio', { name: 'light' }) as HTMLInputElement).checked).toBe(true)
  })

  test('controlled: the value decides', () => {
    const onChange = mock()
    render(<RadioGroup label="theme" options={options} value="dark" onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'light' }))
    expect(onChange).toHaveBeenCalledWith('light')
    expect((screen.getByRole('radio', { name: 'dark' }) as HTMLInputElement).checked).toBe(true)
  })

  test('takes Radio children and a group-wide disabled', () => {
    render(
      <RadioGroup label="size" disabled>
        <Radio value="s" label="small" description="fits more" />
        <Radio value="l" label="large" />
      </RadioGroup>,
    )
    const small = screen.getByRole('radio', { name: 'small' }) as HTMLInputElement
    expect(small.disabled).toBe(true)
    expect(document.getElementById(small.getAttribute('aria-describedby')!)?.textContent).toBe('fits more')
  })
})

describe('Radio', () => {
  test('stands alone with checked/onChange', () => {
    const onChange = mock()
    render(<Radio value="x" label="x" onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio'))
    expect(onChange.mock.calls[0]?.[0]).toBe(true)
  })
})
