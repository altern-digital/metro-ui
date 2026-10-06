import { Tile } from '@altern-digital/metro-ui'

export const title = 'Images'
export const description = 'An image covers the tile. An overlay darkens or tints it so the title reads.'

export default function Images() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 8 }}>
      <Tile size="wide" image="https://picsum.photos/seed/harbor/310/150" imageOverlay title="photos" onClick={() => {}} />
      <Tile image="https://picsum.photos/seed/forest/310/150" imageOverlay="green" title="travel" href="#travel" />
    </div>
  )
}
