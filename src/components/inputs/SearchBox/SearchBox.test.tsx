import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { SearchBox } from './SearchBox'

describe('SearchBox', () => {
  test('searches on Enter and on the glyph button', () => {
    const onSearch = mock()
    render(<SearchBox aria-label="find" defaultValue="tiles" onSearch={onSearch} />)
    const input = screen.getByRole('searchbox')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSearch).toHaveBeenLastCalledWith('tiles')
    fireEvent.change(input, { target: { value: 'metro' } })
    fireEvent.click(screen.getByRole('button', { name: 'search' }))
    expect(onSearch).toHaveBeenLastCalledWith('metro')
  })

  test('controlled value and clearable by default', () => {
    const onChange = mock()
    render(<SearchBox aria-label="find" value="abc" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'clear' }))
    expect(onChange).toHaveBeenCalledWith('', null)
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('abc')
  })

  test('disabled disables the search button', () => {
    render(<SearchBox aria-label="find" disabled />)
    expect((screen.getByRole('button', { name: 'search' }) as HTMLButtonElement).disabled).toBe(true)
  })
})
