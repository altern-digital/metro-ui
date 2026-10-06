import { Tile } from '@altern-digital/metro-ui'
import { VscBell, VscCallOutgoing, VscMail } from 'react-icons/vsc'

export const title = 'Counts, badges and text'
export const description = 'A count sits beside the icon; a badge in the corner; anything else goes in children.'

export default function Content() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 8 }}>
      <Tile tone="teal" icon={VscCallOutgoing} count={2} title="phone" onClick={() => {}} />
      <Tile tone="orange" icon={VscMail} title="outlook" badge={12} onClick={() => {}} />
      <Tile size="wide" tone="purple" title="calendar" badge={<VscBell />} onClick={() => {}}>
        <div style={{ fontSize: 20, fontWeight: 300 }}>design review</div>
        <div style={{ opacity: 0.8 }}>2:00 pm · room 4</div>
      </Tile>
      <Tile tone="lime" title="disabled" disabled onClick={() => {}} />
    </div>
  )
}
