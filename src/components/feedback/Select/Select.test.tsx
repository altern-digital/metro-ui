import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { settle } from '../_overlay/testing'
import { Select, type SelectOption, type SelectProps } from './Select'

const options: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
  { value: 'kale', label: 'Kale', group: 'greens' },
]

function setup(props: Partial<SelectProps> = {}, platform?: 'mobile' | 'desktop') {
  const onChange = mock(() => {})
  const result = render(
    <ConfigProvider platform={platform}>
      <form data-testid="form">
        <Select label="Fruit" name="fruit" options={options} onChange={onChange} {...(props as object)} />
      </form>
      <p>outside</p>
    </ConfigProvider>,
  )
  return { trigger: screen.getByRole('combobox', { name: /Fruit/ }), onChange, ...result }
}

const active = (trigger: HTMLElement) => document.getElementById(trigger.getAttribute('aria-activedescendant') ?? '')?.textContent

describe('Select', () => {
  test('a labelled combobox with the placeholder and a hidden input', () => {
    const { trigger } = setup({ description: 'pick one' })
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.textContent).toBe('select…')
    expect(document.getElementById(trigger.getAttribute('aria-describedby')!)?.textContent).toBe('pick one')
    expect((document.querySelector('input[type=hidden][name=fruit]') as HTMLInputElement).value).toBe('')
  })

  test('click opens a listbox with options and groups; choosing closes and updates', async () => {
    const { trigger, onChange } = setup()
    fireEvent.click(trigger)
    const list = screen.getByRole('listbox')
    expect(trigger.getAttribute('aria-controls')).toBe(list.id)
    expect(screen.getAllByRole('option')).toHaveLength(4)
    expect(screen.getByRole('group', { name: 'greens' })).toBeTruthy()
    fireEvent.click(screen.getByRole('option', { name: 'Cherry' }))
    expect(onChange).toHaveBeenCalledWith('cherry')
    await settle()
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(trigger.textContent).toBe('Cherry')
    expect((document.querySelector('input[name=fruit]') as HTMLInputElement).value).toBe('cherry')
  })

  test('keyboard: arrows skip disabled, Home/End, typeahead, Enter selects, Escape closes', async () => {
    const { trigger, onChange } = setup()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(screen.getByRole('listbox')).toBeTruthy()
    expect(active(trigger)).toBe('Apple')
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(active(trigger)).toBe('Cherry')
    fireEvent.keyDown(trigger, { key: 'End' })
    expect(active(trigger)).toBe('Kale')
    fireEvent.keyDown(trigger, { key: 'Home' })
    expect(active(trigger)).toBe('Apple')
    fireEvent.keyDown(trigger, { key: 'c' })
    expect(active(trigger)).toBe('Cherry')
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('cherry')
    await settle()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(active(trigger)).toBe('Cherry')
    expect(screen.getByRole('option', { name: 'Cherry' }).getAttribute('aria-selected')).toBe('true')
    fireEvent.keyDown(trigger, { key: 'Escape' })
    await settle()
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  test('a press outside closes it', async () => {
    const { trigger } = setup()
    fireEvent.click(trigger)
    fireEvent.pointerDown(screen.getByText('outside'))
    await settle()
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  test('searchable filters, multiple toggles and stays open, clearable empties', async () => {
    const { trigger, onChange } = setup({ multiple: true, searchable: true, clearable: true, defaultValue: ['apple'] } as Partial<SelectProps>)
    expect(trigger.textContent).toBe('Apple')
    fireEvent.click(trigger)
    const search = screen.getByRole('textbox', { name: 'search' })
    fireEvent.change(search, { target: { value: 'ch' } })
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Cherry'])
    fireEvent.keyDown(search, { key: 'Enter' })
    expect(onChange).toHaveBeenLastCalledWith(['apple', 'cherry'])
    expect(screen.getByRole('listbox').getAttribute('aria-multiselectable')).toBe('true')
    expect(document.querySelectorAll('input[name=fruit]')).toHaveLength(2)
    fireEvent.change(search, { target: { value: 'zzz' } })
    expect(screen.getByText('no options', { exact: false })).toBeTruthy()
    fireEvent.keyDown(search, { key: 'Escape' })
    await settle()
    fireEvent.click(screen.getByRole('button', { name: 'clear' }))
    expect(onChange).toHaveBeenLastCalledWith([])
  })

  test('error marks it invalid', () => {
    const { trigger } = setup({ error: 'required' })
    expect(trigger.getAttribute('aria-invalid')).toBe('true')
    expect(document.getElementById(trigger.getAttribute('aria-describedby')!)?.textContent).toBe('required')
  })

  test('mobile: a bottom sheet list', async () => {
    const { trigger, onChange } = setup({}, 'mobile')
    fireEvent.click(trigger)
    expect(document.querySelector('.mt-bottom-sheet')).toBeTruthy()
    expect(document.querySelector('.mt-floating')).toBeNull()
    fireEvent.click(screen.getByRole('option', { name: 'Apple' }))
    expect(onChange).toHaveBeenCalledWith('apple')
    await settle()
    expect(document.querySelector('.mt-bottom-sheet')).toBeNull()
  })
})
