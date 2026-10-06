import { BottomTabBar } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscBell, VscHome, VscMail, VscSearch } from 'react-icons/vsc'

export const title = 'Basic'
export const description = 'Four tabs with a badge on mail.'

export default function Basic() {
  const [tab, setTab] = useState('home')
  return (
    <div style={{ position: 'relative', height: 320, width: 360, maxWidth: '100%', border: '1px solid var(--mt-border)', overflow: 'hidden' }}>
      <p style={{ padding: '0 16px' }}>{tab}</p>
      <BottomTabBar
        position="absolute"
        aria-label="sections"
        value={tab}
        onChange={setTab}
        items={[
          { key: 'home', label: 'home', icon: VscHome },
          { key: 'search', label: 'search', icon: VscSearch },
          { key: 'mail', label: 'mail', icon: VscMail, badge: 7 },
          { key: 'alerts', label: 'alerts', icon: VscBell, disabled: true },
        ]}
      />
    </div>
  )
}
