import { Stack, Text } from '@altern-digital/metro-ui'

export const title = 'Column'

export default function Column() {
  return (
    <Stack gap={2}>
      <Text size="lg">inbox</Text>
      <Text tone="muted">3 unread</Text>
      <Text tone="muted">last synced a minute ago</Text>
    </Stack>
  )
}
