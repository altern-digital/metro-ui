import { NavigationView } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscAccount, VscFiles, VscHome, VscLibrary, VscMail, VscSettingsGear } from 'react-icons/vsc'

export const title = 'Expanded pane'
export const description = 'A full pane with a group and footer rows. The menu button collapses it to icons, remembered under storageKey.'

export default function Expanded() {
  const [page, setPage] = useState('home')
  return (
    <div style={{ position: 'relative', height: 400, border: '1px solid var(--mt-border)', overflow: 'hidden' }}>
      <NavigationView
        mode="expanded"
        position="absolute"
        storageKey="docs-nav-expanded"
        header="mail"
        value={page}
        onChange={setPage}
        items={[
          { key: 'home', label: 'home', icon: VscHome },
          { key: 'inbox', label: 'inbox', icon: VscMail, badge: 12 },
          { key: 'files', label: 'files', icon: VscFiles },
          {
            key: 'library',
            label: 'library',
            icon: VscLibrary,
            items: [
              { key: 'music', label: 'music' },
              { key: 'videos', label: 'videos' },
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
