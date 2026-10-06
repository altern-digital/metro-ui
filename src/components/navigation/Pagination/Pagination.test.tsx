import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { Pagination, paginationRange } from './Pagination'

describe('paginationRange', () => {
  test('shows every page when they fit', () => {
    expect(paginationRange(1, 5)).toEqual([1, 2, 3, 4, 5])
  })
  test('leaves out runs with gaps', () => {
    expect(paginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, null, 20])
    expect(paginationRange(10, 20)).toEqual([1, null, 9, 10, 11, null, 20])
    expect(paginationRange(20, 20)).toEqual([1, null, 16, 17, 18, 19, 20])
  })
})

describe('Pagination', () => {
  test('renders numbered buttons with the current one marked', () => {
    render(<Pagination total={5} defaultPage={2} />)
    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeTruthy()
    const current = screen.getByRole('button', { name: 'page 2' })
    expect(current.getAttribute('aria-current')).toBe('page')
    expect(current.hasAttribute('data-selected')).toBe(true)
  })

  test('uncontrolled: numbers and arrows move', () => {
    const onChange = mock()
    render(<Pagination total={5} onChange={onChange} />)
    expect((screen.getByRole('button', { name: 'previous' }) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'next' }))
    expect(onChange).toHaveBeenLastCalledWith(2)
    fireEvent.click(screen.getByRole('button', { name: 'page 5' }))
    expect(onChange).toHaveBeenLastCalledWith(5)
    expect((screen.getByRole('button', { name: 'next' }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('controlled, from count and pageSize', () => {
    const onChange = mock()
    render(<Pagination count={95} pageSize={10} page={3} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'page 10' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'page 4' }))
    expect(onChange).toHaveBeenCalledWith(4)
    expect(screen.getByRole('button', { name: 'page 3' }).getAttribute('aria-current')).toBe('page')
  })

  test('simple on a phone', () => {
    render(
      <ConfigProvider platform="mobile">
        <Pagination total={12} defaultPage={3} />
      </ConfigProvider>,
    )
    expect(screen.getByText('3 / 12')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'page 3' })).toBeNull()
  })
})
