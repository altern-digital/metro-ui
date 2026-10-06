import { Picker, type PickerValue } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Several columns'
export const description = 'A timer: each column loops on its own.'

const range = (n: number) => Array.from({ length: n }, (_, i) => ({ value: i, label: String(i).padStart(2, '0') }))

export default function Custom() {
  const [value, setValue] = useState<PickerValue>({ h: 0, m: 5, s: 0 })
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <Picker
        loop
        value={value}
        onChange={setValue}
        columns={[
          { key: 'h', label: 'hours', options: range(24) },
          { key: 'm', label: 'minutes', options: range(60) },
          { key: 's', label: 'seconds', options: range(60) },
        ]}
      />
      <span>
        {value.h}h {value.m}m {value.s}s
      </span>
    </div>
  )
}
