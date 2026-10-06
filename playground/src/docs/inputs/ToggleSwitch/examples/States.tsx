import { ToggleSwitch } from '@altern-digital/metro-ui'

export const title = 'Disabled'

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <ToggleSwitch label="Bluetooth" disabled />
      <ToggleSwitch label="Location" defaultChecked disabled />
    </div>
  )
}
