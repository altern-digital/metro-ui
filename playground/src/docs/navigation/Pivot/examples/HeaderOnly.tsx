import { Pivot } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscFile, VscFileMedia, VscFilePdf } from 'react-icons/vsc'

export const title = 'Headers only'
export const description = 'Use the header row as a filter and render the content yourself.'

const FILES = [
  { name: 'report.pdf', kind: 'documents', icon: VscFilePdf },
  { name: 'notes.txt', kind: 'documents', icon: VscFile },
  { name: 'holiday.jpg', kind: 'pictures', icon: VscFileMedia },
]

export default function HeaderOnly() {
  const [filter, setFilter] = useState('all')
  const shown = FILES.filter((f) => filter === 'all' || f.kind === filter)
  return (
    <div>
      <Pivot headerOnly value={filter} onChange={setFilter} items={['all', 'documents', 'pictures'].map((key) => ({ key, label: key }))} />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {shown.map(({ name, icon: Icon }) => (
          <li key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
            <Icon /> {name}
          </li>
        ))}
      </ul>
    </div>
  )
}
