import { Button, ProgressRing } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Determinate'

export default function Determinate() {
  const [value, setValue] = useState(25)
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <ProgressRing value={value} size="lg" label="installing" />
      <Button onClick={() => setValue((v) => (v >= 100 ? 0 : v + 25))}>step</Button>
    </div>
  )
}
