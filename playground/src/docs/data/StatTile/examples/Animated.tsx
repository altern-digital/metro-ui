import { Button, StatTile } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Animated'
export const description = 'Counts up on mount and to each new value.'

export default function Animated() {
  const [visits, setVisits] = useState(2480)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
      <StatTile tone="purple" label="visits today" value={visits} animate style={{ minWidth: 220 }} />
      <Button onClick={() => setVisits((v) => v + Math.round(Math.random() * 900))}>refresh</Button>
    </div>
  )
}
