import { Badge } from '@altern-digital/metro-ui'

export const title = 'Counts'

export default function Counts() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Badge count={3} />
      <Badge count={42} tone="danger" />
      <Badge count={150} />
      <Badge count={0} showZero tone="gray" />
    </div>
  )
}
