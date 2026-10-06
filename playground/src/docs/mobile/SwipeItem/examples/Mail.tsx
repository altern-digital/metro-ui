import { SwipeItem } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscArchive, VscMail, VscPinned, VscTrash } from 'react-icons/vsc'

export const title = 'Both sides'
export const description = 'Swipe a row on a touch screen, or hover it with a mouse to see the same actions.'

const START = ['lunch on friday?', 'your order has shipped', 'weekly report', 'new comment on your post']

export default function Mail() {
  const [rows, setRows] = useState(START)
  const [pinned, setPinned] = useState<string[]>([])
  const remove = (row: string) => setRows((all) => all.filter((r) => r !== row))
  return (
    <div style={{ width: 360, maxWidth: '100%', border: '1px solid var(--mt-border)' }}>
      {rows.map((row) => (
        <SwipeItem
          key={row}
          leftActions={[{ key: 'pin', label: 'pin', icon: VscPinned, tone: 'info', onClick: () => setPinned((p) => [...p, row]) }]}
          rightActions={[
            { key: 'archive', label: 'archive', icon: VscArchive, tone: 'success', onClick: () => remove(row) },
            { key: 'delete', label: 'delete', icon: VscTrash, tone: 'danger', onClick: () => remove(row) },
          ]}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
            {pinned.includes(row) ? <VscPinned /> : <VscMail />} {row}
          </div>
        </SwipeItem>
      ))}
      {rows.length === 0 && <p style={{ padding: 16, margin: 0 }}>all done</p>}
    </div>
  )
}
