import { LiveTile } from '@altern-digital/metro-ui'
import { VscPerson } from 'react-icons/vsc'

export const title = 'Peek'
export const description = 'Each photo slides up to show who it is, then the next one comes.'

export default function Peek() {
  return (
    <LiveTile
      size="wide"
      tone="orange"
      icon={VscPerson}
      title="people"
      effect="peek"
      interval={3000}
      faces={[
        { image: 'https://picsum.photos/seed/ana/310/150', content: <div style={{ fontSize: 18 }}>ana posted 4 photos</div> },
        { image: 'https://picsum.photos/seed/budi/310/150', content: <div style={{ fontSize: 18 }}>budi is at the beach</div> },
        { image: 'https://picsum.photos/seed/citra/310/150', content: <div style={{ fontSize: 18 }}>citra changed jobs</div> },
      ]}
      onClick={() => {}}
    />
  )
}
