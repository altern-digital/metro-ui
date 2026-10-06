import { LiveTile, Tile, TileGrid } from '@altern-digital/metro-ui'
import { VscCallOutgoing, VscComment, VscDeviceCamera, VscMail, VscMusic, VscPerson, VscSettingsGear, VscStarFull } from 'react-icons/vsc'

export const title = 'Phone'
export const description = 'The vertical layout of Windows Phone: one column of tiles, two medium tiles across.'

export default function Phone() {
  return (
    <div style={{ maxWidth: 340 }}>
      <TileGrid layout="vertical">
        <Tile tone="teal" icon={VscCallOutgoing} title="phone" count={1} onClick={() => {}} />
        <Tile tone="teal" icon={VscComment} title="messaging" onClick={() => {}} />
        <LiveTile
          size="wide"
          tone="teal"
          icon={VscPerson}
          title="people"
          effect="peek"
          faces={[
            { image: 'https://picsum.photos/seed/sari/310/150', content: <div style={{ fontSize: 16 }}>sari shared an album</div> },
            { image: 'https://picsum.photos/seed/tomo/310/150', content: <div style={{ fontSize: 16 }}>tomo checked in</div> },
          ]}
          onClick={() => {}}
        />
        <Tile tone="teal" icon={VscMail} title="mail" badge={5} onClick={() => {}} />
        <Tile size="small" tone="teal" icon={VscDeviceCamera} aria-label="camera" onClick={() => {}} />
        <Tile size="small" tone="teal" icon={VscMusic} aria-label="music" onClick={() => {}} />
        <Tile size="small" tone="teal" icon={VscStarFull} aria-label="store" onClick={() => {}} />
        <Tile size="small" tone="teal" icon={VscSettingsGear} aria-label="settings" onClick={() => {}} />
      </TileGrid>
    </div>
  )
}
