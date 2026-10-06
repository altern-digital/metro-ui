import { Divider, Text } from '@altern-digital/metro-ui'

export const title = 'Horizontal'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Text>sign in with your account</Text>
      <Divider label="or" />
      <Text>continue as a guest</Text>
      <Divider />
    </div>
  )
}
