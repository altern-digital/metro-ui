import { Table, type TableSort } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Sorting and row clicks'
export const description = 'Press a header to sort; press it again to reverse. Rows are pressable.'

const apps = [
  { id: 'mail', name: 'Mail', size: 48.2, updated: '2026-09-30' },
  { id: 'maps', name: 'Maps', size: 212.9, updated: '2026-08-14' },
  { id: 'music', name: 'Music', size: 96.5, updated: '2026-10-02' },
  { id: 'photos', name: 'Photos', size: 154, updated: '2026-07-21' },
]

export default function Sorting() {
  const [sort, setSort] = useState<TableSort | null>({ key: 'size', direction: 'desc' })
  const [opened, setOpened] = useState<string>()
  return (
    <div>
      <Table
        data={apps}
        sort={sort}
        onSortChange={setSort}
        onRowClick={(app) => setOpened(app.name)}
        columns={[
          { key: 'name', title: 'app', sortable: true },
          { key: 'updated', title: 'updated', sortable: true },
          { key: 'size', title: 'size', align: 'right', sortable: true, render: (a) => `${a.size} MB` },
        ]}
      />
      <p style={{ opacity: 0.7 }}>{opened ? `opened ${opened}` : 'press a row'}</p>
    </div>
  )
}
