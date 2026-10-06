import { TextField } from '@altern-digital/metro-ui'

export const title = 'Error, disabled, read-only'

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
      <TextField label="Username" defaultValue="admin" error="That name is taken." />
      <TextField label="Account id" defaultValue="A-10442" disabled />
      <TextField label="Region" defaultValue="ap-southeast-1" readOnly />
    </div>
  )
}
