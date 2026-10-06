import { Checkbox } from '@altern-digital/metro-ui'

export const title = 'Basic'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox label="Remember me" defaultChecked />
      <Checkbox label="Send me updates" description="About once a month. You can stop any time." />
    </div>
  )
}
