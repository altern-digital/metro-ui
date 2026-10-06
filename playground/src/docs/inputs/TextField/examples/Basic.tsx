import { TextField } from '@altern-digital/metro-ui'

export const title = 'Basic'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
      <TextField label="Full name" placeholder="Jane Doe" />
      <TextField label="Email" type="email" description="We only use it to sign you in." clearable />
    </div>
  )
}
