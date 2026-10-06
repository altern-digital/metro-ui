import { Text } from '@altern-digital/metro-ui'

export const title = 'Tones'

export default function Tones() {
  return (
    <div style={{ display: 'grid', gap: 4 }}>
      <Text>default</Text>
      <Text tone="muted">muted, for secondary lines</Text>
      <Text tone="accent">accent</Text>
      <Text tone="success">saved</Text>
      <Text tone="warning">almost full</Text>
      <Text tone="danger">could not connect</Text>
    </div>
  )
}
