import { NavigationView } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscAccount, VscBell, VscHome, VscLibrary, VscMail, VscSearch, VscSettingsGear } from 'react-icons/vsc'

export const title = 'Bottom bar'
export const description = 'The phone form. Four tabs fit; the rest, groups and footer rows go under "more".'

export default function Bottom() {
  const [page, setPage] = useState('home')
  return (
    <div style={{ position: 'relative', height: 480, width: 360, maxWidth: '100%', border: '1px solid var(--mt-border)', overflow: 'hidden' }}>
      <NavigationView
        mode="bottom"
        position="absolute"
        header="social"
        value={page}
        onChange={setPage}
        items={[
          { key: 'home', label: 'home', icon: VscHome },
          { key: 'search', label: 'search', icon: VscSearch },
          { key: 'mail', label: 'mail', icon: VscMail, badge: 4 },
          { key: 'alerts', label: 'alerts', icon: VscBell },
          {
            key: 'library',
            label: 'library',
            icon: VscLibrary,
            items: [
              { key: 'saved', label: 'saved' },
              { key: 'history', label: 'history' },
            ],
          },
        ]}
        footerItems={[
          { key: 'account', label: 'account', icon: VscAccount },
          { key: 'settings', label: 'settings', icon: VscSettingsGear },
        ]}
      >
        <div style={{ padding: 24 }}>{page}</div>
      </NavigationView>
    </div>
  )
}
