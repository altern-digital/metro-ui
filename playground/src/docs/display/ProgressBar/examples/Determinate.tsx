import { Button, ProgressBar } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Determinate'

export default function Determinate() {
  const [value, setValue] = useState(30)
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <ProgressBar value={value} label={`uploading ${value}%`} />
      <ProgressBar value={88} tone="warning" label="storage 88% full" />
      <Button onClick={() => setValue((v) => (v >= 100 ? 0 : v + 10))}>step</Button>
    </div>
  )
}
