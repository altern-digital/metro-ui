import { Tile } from '@altern-digital/metro-ui'
import { VscCalendar, VscComment, VscMail, VscSettingsGear } from 'react-icons/vsc'

export const title = 'Sizes'
export const description = 'Small, medium, wide and large. Small tiles hide their title.'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 8 }}>
      <Tile size="small" tone="slate" icon={VscSettingsGear} aria-label="settings" onClick={() => {}} />
      <Tile size="medium" tone="green" icon={VscComment} title="messaging" onClick={() => {}} />
      <Tile size="wide" tone="blue" icon={VscMail} title="mail" onClick={() => {}} />
      <Tile size="large" tone="red" icon={VscCalendar} title="calendar" onClick={() => {}} />
    </div>
  )
}
