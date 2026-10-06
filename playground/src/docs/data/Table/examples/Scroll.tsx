import { Table } from '@altern-digital/metro-ui'

export const title = 'Sticky header'
export const description = 'With maxHeight the body scrolls and the header stays. On a phone, mobileLayout="scroll" keeps the table.'

const rows = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, city: `Station ${i + 1}`, riders: 1200 + ((i * 7919) % 5000) }))

export default function Scroll() {
  return (
    <Table
      maxHeight={260}
      mobileLayout="scroll"
      data={rows}
      columns={[
        { key: 'id', title: '#', width: 48, align: 'right' },
        { key: 'city', title: 'station', sortable: true },
        { key: 'riders', title: 'riders / day', align: 'right', sortable: true, render: (r) => r.riders.toLocaleString() },
      ]}
    />
  )
}
