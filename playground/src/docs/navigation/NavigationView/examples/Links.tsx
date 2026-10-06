import { NavigationView } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscBook, VscGithub, VscHome } from 'react-icons/vsc'

export const title = 'Automatic, with links'
export const description = 'mode="auto" picks the form from the window and the platform. Rows with href are links; pass your router\'s Link as linkComponent.'

export default function Links() {
  const [page, setPage] = useState('home')
  return (
    <div style={{ position: 'relative', height: 360, border: '1px solid var(--mt-border)', overflow: 'hidden' }}>
      <NavigationView
        position="absolute"
        header="site"
        value={page}
        onChange={setPage}
        items={[
          { key: 'home', label: 'home', icon: VscHome, href: '#home' },
          { key: 'guide', label: 'guide', icon: VscBook, href: '#guide' },
          { key: 'source', label: 'source', icon: VscGithub, href: '#source' },
        ]}
      >
        <div style={{ padding: 24 }}>{page}</div>
      </NavigationView>
    </div>
  )
}
