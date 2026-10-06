import { Hub } from '@altern-digital/metro-ui'
import { VscPerson } from 'react-icons/vsc'

export const title = 'Background and phone form'
export const description = 'A parallax background image, and the phone form where each section fills the screen and snaps.'

const BG = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600'

export default function Background() {
  return (
    <div style={{ height: 420, width: 360, maxWidth: '100%', border: '1px solid var(--mt-border)' }}>
      <Hub
        platform="mobile"
        background={BG}
        parallax={0.3}
        title="people"
        sections={[
          { key: 'all', title: 'all', content: <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}><VscPerson /> 214 contacts</p> },
          { key: 'whats-new', title: "what's new", content: <p>ana changed her profile picture</p> },
          { key: 'together', title: 'together', content: <p>no groups yet</p> },
        ]}
      />
    </div>
  )
}
