import { SearchBox } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Live filter'

const apps = ['Mail', 'Calendar', 'People', 'Photos', 'Music', 'Video', 'Maps', 'Weather', 'News', 'Store']

export default function Live() {
  const [filter, setFilter] = useState('')
  const shown = apps.filter((a) => a.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
      <SearchBox label="Apps" value={filter} onChange={setFilter} placeholder="filter" />
      <div>{shown.join(', ') || 'no apps'}</div>
    </div>
  )
}
