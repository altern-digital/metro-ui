import { Avatar } from '@altern-digital/metro-ui'

export const title = 'Sizes'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
      <Avatar name="Sam Lee" size="sm" />
      <Avatar name="Sam Lee" size="md" />
      <Avatar name="Sam Lee" size="lg" />
      <Avatar name="Sam Lee" size="xl" />
      <Avatar name="Sam Lee" size={120} tone="accent" />
    </div>
  )
}
