import { Hub } from '@altern-digital/metro-ui'
import { VscPlay } from 'react-icons/vsc'

export const title = 'Basic'
export const description = 'Scroll sideways with the wheel, a trackpad or a finger.'

const songs = ['morning light', 'paper planes', 'slow river', 'night bus']

export default function Basic() {
  return (
    <div style={{ height: 360, border: '1px solid var(--mt-border)' }}>
      <Hub
        title="music"
        sections={[
          {
            key: 'now',
            title: 'now playing',
            width: 320,
            content: (
              <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <VscPlay /> paper planes
              </p>
            ),
          },
          { key: 'recent', title: 'recent', width: 280, content: <ul style={{ paddingLeft: 16 }}>{songs.map((s) => <li key={s}>{s}</li>)}</ul> },
          { key: 'new', title: 'new', width: 360, content: <p>three new albums this week</p> },
          { key: 'radio', title: 'radio', content: <p>stations picked for you</p> },
        ]}
      />
    </div>
  )
}
