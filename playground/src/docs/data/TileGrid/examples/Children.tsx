import { Tile, TileGrid } from '@altern-digital/metro-ui'

export const title = 'Sizing'
export const description = 'Set the cell size and gap; tiles of every size pack into the gaps.'

const tones = ['blue', 'green', 'orange', 'purple', 'red', 'teal'] as const

export default function Children() {
  return (
    <TileGrid layout="vertical" tileSize={80} gap={4} animate={false}>
      <Tile size="wide" tone="slate" title="wide" />
      {tones.map((tone) => (
        <Tile key={tone} size="small" tone={tone} aria-label={tone} />
      ))}
      <Tile tone="indigo" title="medium" />
      <Tile size="large" tone="amber" title="large" />
    </TileGrid>
  )
}
