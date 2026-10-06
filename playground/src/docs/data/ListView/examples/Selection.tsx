import { ListItem, ListView } from '@altern-digital/metro-ui'
import { useState, type Key } from 'react'

export const title = 'Selection'
export const description = 'A multiple-selection listbox. Click rows, or use the arrows and Space.'

const ringtones = [
  { id: 'chimes', name: 'Chimes', length: '0:12' },
  { id: 'harbor', name: 'Harbor', length: '0:20' },
  { id: 'lumen', name: 'Lumen', length: '0:08' },
  { id: 'ripple', name: 'Ripple', length: '0:15' },
]

export default function Selection() {
  const [selected, setSelected] = useState<Key[]>(['harbor'])
  return (
    <div style={{ maxWidth: 420 }}>
      <ListView
        header="ringtones"
        selectionMode="multiple"
        selected={selected}
        onSelectionChange={setSelected}
        items={ringtones}
        renderItem={(r) => <ListItem title={r.name} meta={r.length} />}
      />
      <p style={{ opacity: 0.7 }}>selected: {selected.join(', ') || 'none'}</p>
    </div>
  )
}
