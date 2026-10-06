import { Segmented } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Basic'

export default function Basic() {
  const [range, setRange] = useState('week')
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <Segmented
        aria-label="range"
        value={range}
        onChange={setRange}
        options={[
          { value: 'day', label: 'day' },
          { value: 'week', label: 'week' },
          { value: 'month', label: 'month' },
          { value: 'year', label: 'year', disabled: true },
        ]}
      />
      <span>showing: {range}</span>
    </div>
  )
}
