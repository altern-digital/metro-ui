import { ToggleSwitch } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Controlled, custom state text'

export default function Controlled() {
  const [visible, setVisible] = useState(true)
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <ToggleSwitch label="Profile" checked={visible} onChange={setVisible} onLabel="public" offLabel="private" />
      <ToggleSwitch label="Location" aria-label="Location" defaultChecked onLabel={null} />
    </div>
  )
}
