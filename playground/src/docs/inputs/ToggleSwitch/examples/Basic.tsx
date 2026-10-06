import { ToggleSwitch } from '@altern-digital/metro-ui'

export const title = 'Basic'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <ToggleSwitch label="Wi-Fi" defaultChecked />
      <ToggleSwitch label="Airplane mode" />
    </div>
  )
}
