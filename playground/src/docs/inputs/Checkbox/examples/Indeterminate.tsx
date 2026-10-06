import { Checkbox } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Select all'
export const description = 'The parent is indeterminate while only some children are checked.'

const items = ['Mail', 'Calendar', 'People']

export default function Indeterminate() {
  const [checked, setChecked] = useState<string[]>(['Mail'])
  const all = checked.length === items.length
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox
        label="Sync everything"
        checked={all}
        indeterminate={checked.length > 0 && !all}
        onChange={(on) => setChecked(on ? items : [])}
      />
      <div style={{ display: 'grid', gap: 12, paddingInlineStart: 32 }}>
        {items.map((item) => (
          <Checkbox
            key={item}
            label={item}
            checked={checked.includes(item)}
            onChange={(on) => setChecked((c) => (on ? [...c, item] : c.filter((x) => x !== item)))}
          />
        ))}
      </div>
    </div>
  )
}
