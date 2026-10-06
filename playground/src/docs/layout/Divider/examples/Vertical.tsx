import { Divider, Stack, Text } from '@altern-digital/metro-ui'

export const title = 'Vertical'

export default function Vertical() {
  return (
    <Stack direction="row" align="stretch" style={{ height: 24 }}>
      <Text>12 files</Text>
      <Divider orientation="vertical" />
      <Text>3.4 MB</Text>
      <Divider orientation="vertical" />
      <Text tone="muted">synced</Text>
    </Stack>
  )
}
