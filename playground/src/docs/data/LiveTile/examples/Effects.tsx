import { LiveTile } from '@altern-digital/metro-ui'
import { VscCalendar, VscGlobe } from 'react-icons/vsc'

export const title = 'Slide and flip'
export const description = 'News slides up as on Windows Phone; the calendar turns over.'

const headline = (text: string, source: string) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div style={{ fontSize: 18, lineHeight: 1.2 }}>{text}</div>
    <div style={{ opacity: 0.8, fontSize: 12 }}>{source}</div>
  </div>
)

export default function Effects() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 8 }}>
      <LiveTile
        size="wide"
        tone="red"
        icon={VscGlobe}
        title="news"
        interval={3500}
        faces={[
          headline('Rail line to the airport opens next month', 'city desk'),
          headline('Local bakery wins national bread prize', 'food'),
          headline('Weekend forecast: clear skies, light wind', 'weather'),
        ]}
        onClick={() => {}}
      />
      <LiveTile
        tone="purple"
        icon={VscCalendar}
        title="calendar"
        effect="flip"
        interval={4000}
        faces={[
          <div key="a"><div style={{ fontSize: 16 }}>standup</div><div style={{ opacity: 0.8 }}>9:30 am</div></div>,
          <div key="b"><div style={{ fontSize: 16 }}>lunch with ana</div><div style={{ opacity: 0.8 }}>12:30 pm</div></div>,
        ]}
        onClick={() => {}}
      />
    </div>
  )
}
