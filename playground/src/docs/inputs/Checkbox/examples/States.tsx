import { Checkbox } from '@altern-digital/metro-ui'

export const title = 'Disabled'

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox label="Off" disabled />
      <Checkbox label="On" defaultChecked disabled />
      <Checkbox label="Mixed" indeterminate disabled />
    </div>
  )
}
