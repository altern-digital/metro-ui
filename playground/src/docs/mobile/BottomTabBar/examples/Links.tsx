import { BottomTabBar } from '@altern-digital/metro-ui'
import { VscAccount, VscCompass, VscHome } from 'react-icons/vsc'

export const title = 'Links'
export const description = 'Tabs with href are links. Pass the route that is showing as value.'

export default function Links() {
  return (
    <div style={{ position: 'relative', height: 240, width: 360, maxWidth: '100%', border: '1px solid var(--mt-border)', overflow: 'hidden' }}>
      <BottomTabBar
        position="absolute"
        defaultValue="explore"
        items={[
          { key: 'home', label: 'home', icon: VscHome, href: '#home' },
          { key: 'explore', label: 'explore', icon: VscCompass, href: '#explore' },
          { key: 'me', label: 'me', icon: VscAccount, href: '#me' },
        ]}
      />
    </div>
  )
}
