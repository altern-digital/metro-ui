import { PasswordBox } from '@altern-digital/metro-ui'

export const title = 'Basic'

export default function Basic() {
  return (
    <div style={{ maxWidth: 320 }}>
      <PasswordBox label="Password" defaultValue="correct horse" />
    </div>
  )
}
