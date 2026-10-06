import { LiveTile, Tile, TileGrid } from '@altern-digital/metro-ui'
import {
  VscCalendar,
  VscCallOutgoing,
  VscCloud,
  VscComment,
  VscDeviceCamera,
  VscGame,
  VscGlobe,
  VscGraph,
  VscLibrary,
  VscMail,
  VscMap,
  VscMusic,
  VscSearch,
  VscSettingsGear,
} from 'react-icons/vsc'

export const title = 'Start screen'
export const description = 'Two groups side by side, mixing every size, live tiles and images. Scroll sideways.'

const go = () => {}

export default function StartScreen() {
  return (
    <TileGrid
      layout="horizontal"
      tileSize={120}
      groups={[
        {
          title: 'life at a glance',
          tiles: (
            <>
              <LiveTile
                size="wide"
                tone="blue"
                icon={VscMail}
                title="mail"
                counter={8}
                faces={[
                  <div key="a"><div style={{ fontSize: 16 }}>Quarterly numbers</div><div style={{ opacity: 0.8 }}>finance team</div></div>,
                  <div key="b"><div style={{ fontSize: 16 }}>Dinner on friday?</div><div style={{ opacity: 0.8 }}>rani</div></div>,
                ]}
                onClick={go}
              />
              <Tile tone="purple" icon={VscCalendar} title="calendar" onClick={go} />
              <Tile size="small" tone="teal" icon={VscCallOutgoing} aria-label="phone" badge={2} onClick={go} />
              <Tile size="small" tone="green" icon={VscComment} aria-label="messaging" onClick={go} />
              <Tile size="small" tone="slate" icon={VscSettingsGear} aria-label="settings" onClick={go} />
              <Tile size="small" tone="gray" icon={VscSearch} aria-label="search" onClick={go} />
              <LiveTile
                size="large"
                icon={VscDeviceCamera}
                title="photos"
                effect="flip"
                interval={4500}
                faces={[
                  { image: 'https://picsum.photos/seed/lake/310/310' },
                  { image: 'https://picsum.photos/seed/city/310/310' },
                  { image: 'https://picsum.photos/seed/dunes/310/310' },
                ]}
                onClick={go}
              />
              <Tile tone="cyan" icon={VscCloud} title="weather" count="24°" onClick={go} />
              <Tile tone="indigo" icon={VscGraph} title="money" onClick={go} />
            </>
          ),
        },
        {
          title: 'play and explore',
          tiles: (
            <>
              <LiveTile
                size="wide"
                tone="red"
                icon={VscGlobe}
                title="news"
                faces={[
                  <div key="a" style={{ fontSize: 18 }}>New metro line opens to riders on monday</div>,
                  <div key="b" style={{ fontSize: 18 }}>Coastal town plans its first film festival</div>,
                ]}
                onClick={go}
              />
              <Tile tone="green" icon={VscGame} title="games" onClick={go} />
              <Tile tone="orange" icon={VscMusic} title="music" onClick={go} />
              <Tile size="wide" image="https://picsum.photos/seed/trail/310/150" imageOverlay title="travel" onClick={go} />
              <Tile tone="amber" icon={VscMap} title="maps" onClick={go} />
              <Tile tone="pink" icon={VscLibrary} title="reading" onClick={go} />
            </>
          ),
        },
      ]}
    />
  )
}
