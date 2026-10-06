import { ProgressRing } from '@altern-digital/metro-ui'

export const title = 'Sizes and tones'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <ProgressRing size="sm" />
      <ProgressRing />
      <ProgressRing size="lg" />
      <ProgressRing size={48} tone="orange" label="syncing" />
    </div>
  )
}
