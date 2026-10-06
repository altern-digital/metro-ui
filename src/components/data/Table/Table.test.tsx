import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { Table, type TableColumn } from './Table'

interface Row {
  id: number
  name: string
  amount: number
}
const rows: Row[] = [
  { id: 1, name: 'rent', amount: 1200 },
  { id: 2, name: 'coffee', amount: 4 },
  { id: 3, name: 'books', amount: 60 },
]
const columns: TableColumn<Row>[] = [
  { key: 'name', title: 'name', sortable: true, footer: 'total' },
  { key: 'amount', title: 'amount', align: 'right', sortable: true, footer: '1264' },
]
const names = () => screen.getAllByRole('row').slice(1, 4).map((r) => r.querySelector('td')!.textContent)

describe('Table', () => {
  test('renders headers, rows and a footer', () => {
    render(<Table columns={columns} data={rows} caption="spending" />)
    expect(screen.getByRole('table', { name: 'spending' })).toBeTruthy()
    expect(names()).toEqual(['rent', 'coffee', 'books'])
    expect(screen.getByText('total')).toBeTruthy()
    expect(screen.getByText('4').closest('td')!.dataset.align).toBe('right')
  })

  test('sorts by a column and reports aria-sort', () => {
    const onSortChange = mock()
    render(<Table columns={columns} data={rows} onSortChange={onSortChange} />)
    const header = screen.getByRole('columnheader', { name: 'amount' })
    expect(header.getAttribute('aria-sort')).toBe('none')
    fireEvent.click(within(header).getByRole('button'))
    expect(header.getAttribute('aria-sort')).toBe('ascending')
    expect(names()).toEqual(['coffee', 'books', 'rent'])
    fireEvent.click(within(header).getByRole('button'))
    expect(header.getAttribute('aria-sort')).toBe('descending')
    expect(names()).toEqual(['rent', 'books', 'coffee'])
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'amount', direction: 'desc' })
  })

  test('leaves rows alone with manualSort', () => {
    render(<Table columns={columns} data={rows} manualSort defaultSort={{ key: 'name', direction: 'asc' }} />)
    expect(names()).toEqual(['rent', 'coffee', 'books'])
  })

  test('clicks rows, by mouse and keyboard', () => {
    const onRowClick = mock()
    render(<Table columns={columns} data={rows} onRowClick={onRowClick} />)
    const row = screen.getByText('coffee').closest('tr')!
    fireEvent.click(row)
    fireEvent.keyDown(row, { key: 'Enter' })
    expect(onRowClick).toHaveBeenCalledTimes(2)
    expect(onRowClick.mock.calls[0]![0]).toEqual(rows[1])
  })

  test('shows loading and empty states', () => {
    const { container, rerender } = render(<Table columns={columns} data={[]} empty="no spending" />)
    expect(screen.getByText('no spending')).toBeTruthy()
    rerender(<Table columns={columns} data={rows} loading />)
    const root = container.querySelector('.mt-table') as HTMLElement
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(root.hasAttribute('data-loading')).toBe(true)
    expect(container.querySelector('.mt-table-rule i')).toBeTruthy()
  })

  test('stacks rows as cards on mobile, unless told to scroll', () => {
    const { container, rerender } = render(
      <ConfigProvider platform="mobile">
        <Table columns={columns} data={rows} />
      </ConfigProvider>,
    )
    expect((container.querySelector('.mt-table') as HTMLElement).dataset.layout).toBe('cards')
    expect(container.querySelectorAll('.mt-table-card')).toHaveLength(4)
    expect(screen.queryByRole('table')).toBeNull()
    rerender(
      <ConfigProvider platform="mobile">
        <Table columns={columns} data={rows} mobileLayout="scroll" />
      </ConfigProvider>,
    )
    expect(screen.getByRole('table')).toBeTruthy()
  })
})
