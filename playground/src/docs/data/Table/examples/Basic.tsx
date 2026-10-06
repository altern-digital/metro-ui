import { Table } from '@altern-digital/metro-ui'

export const title = 'Basic'
export const description = 'Right-aligned numbers in tabular figures, and a totals row.'

const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const rows = [
  { id: 1, date: 'oct 01', payee: 'Harbor Rentals', category: 'housing', amount: 1450 },
  { id: 2, date: 'oct 02', payee: 'Corner Market', category: 'groceries', amount: 86.4 },
  { id: 3, date: 'oct 03', payee: 'Metro Transit', category: 'travel', amount: 32 },
  { id: 4, date: 'oct 05', payee: 'Lumen Energy', category: 'utilities', amount: 112.75 },
]

export default function Basic() {
  return (
    <Table
      caption="october"
      data={rows}
      columns={[
        { key: 'date', title: 'date', width: 90 },
        { key: 'payee', title: 'payee' },
        { key: 'category', title: 'category' },
        { key: 'amount', title: 'amount', align: 'right', render: (r) => money(r.amount), footer: money(rows.reduce((s, r) => s + r.amount, 0)) },
      ]}
    />
  )
}
