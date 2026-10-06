import { InfoBar } from '@altern-digital/metro-ui'
import { VscCloud } from 'react-icons/vsc'

export const title = 'Fill and custom icon'
export const description = 'appearance="fill" tints the whole bar. Pass an icon to replace the glyph.'

export default function Fill() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <InfoBar appearance="fill" severity="success" message="You are signed in on 3 devices." />
      <InfoBar appearance="fill" icon={VscCloud} message="Files open from the cloud when you need them." />
      <InfoBar appearance="fill" severity="error" icon={false} message="No glyph, only the colour." />
    </div>
  )
}
