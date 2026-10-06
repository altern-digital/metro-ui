import { Text } from '@altern-digital/metro-ui'

export const title = 'Sizes and weights'

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 4 }}>
      <Text size="display" weight={200}>42</Text>
      <Text size="2xl" weight={300}>a light heading size</Text>
      <Text size="lg">large body copy</Text>
      <Text>base body copy</Text>
      <Text size="xs" mono>build 2026.10.06</Text>
    </div>
  )
}
