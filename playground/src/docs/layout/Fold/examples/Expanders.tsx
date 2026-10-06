import { Expander, Text } from '@altern-digital/metro-ui'
import { VscBell, VscLock } from 'react-icons/vsc'

export const title = 'Expander'
export const description = 'The boxed form, with an icon and a description.'

export default function Expanders() {
  return (
    <div style={{ display: 'grid', gap: 4 }}>
      <Expander icon={VscBell} title="notifications" description="banners, sounds and badges">
        <Text>show banners for mentions only.</Text>
      </Expander>
      <Expander icon={VscLock} title="privacy" description="managed by your organisation" disabled>
        <Text>locked.</Text>
      </Expander>
    </div>
  )
}
