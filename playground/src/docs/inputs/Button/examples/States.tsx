import { Button } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Loading and disabled'

export default function States() {
  const [saving, setSaving] = useState(false)
  const save = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1500)
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button variant="accent" loading={saving} onClick={save}>save</Button>
      <Button disabled>disabled</Button>
      <Button href="#button">a link</Button>
    </div>
  )
}
