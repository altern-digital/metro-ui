import { SwipeItem } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscCheck, VscTrash } from 'react-icons/vsc'

export const title = 'Full swipe'
export const description = 'Drag most of the way across to run the action straight away.'

export default function FullSwipe() {
  const [tasks, setTasks] = useState(['water the plants', 'call the bank', 'book flights'])
  const [done, setDone] = useState<string[]>([])
  return (
    <div style={{ width: 360, maxWidth: '100%', border: '1px solid var(--mt-border)' }}>
      {tasks.map((task) => (
        <SwipeItem
          key={task}
          fullSwipe
          actionWidth={88}
          leftActions={[{ key: 'done', label: 'done', icon: VscCheck, tone: 'success', onClick: () => setDone((d) => [...d, task]) }]}
          rightActions={[{ key: 'delete', label: 'delete', icon: VscTrash, tone: 'danger', onClick: () => setTasks((t) => t.filter((x) => x !== task)) }]}
        >
          <div style={{ padding: '12px 16px', textDecoration: done.includes(task) ? 'line-through' : undefined }}>{task}</div>
        </SwipeItem>
      ))}
    </div>
  )
}
