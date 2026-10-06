import { Button, Table } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Loading and empty'
export const description = 'While loading, rows dim and a bar runs along the header rule.'

const columns = [
  { key: 'name', title: 'file' },
  { key: 'size', title: 'size', align: 'right' as const },
]

export default function States() {
  const [loading, setLoading] = useState(true)
  const [empty, setEmpty] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => setLoading((l) => !l)}>{loading ? 'stop loading' : 'load'}</Button>
        <Button onClick={() => setEmpty((e) => !e)}>{empty ? 'show files' : 'clear'}</Button>
      </div>
      <Table
        loading={loading}
        empty="this folder is empty"
        columns={columns}
        data={empty ? [] : [{ id: 1, name: 'report.pdf', size: '2.1 MB' }, { id: 2, name: 'budget.xlsx', size: '640 KB' }]}
      />
    </div>
  )
}
