import { StatTile } from '@altern-digital/metro-ui'

export const title = 'Tones'
export const description = 'With a tone the stat fills like a tile.'

export default function Tones() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
      <StatTile tone="blue" label="balance" value={12500.5} format={(n) => `$${n.toLocaleString()}`} delta={320} />
      <StatTile tone="green" label="uptime" value="99.98%" caption="last 30 days" />
      <StatTile tone="amber" label="open tickets" value={17} delta={3} invertDelta />
    </div>
  )
}
