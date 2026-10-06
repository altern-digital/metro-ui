import { CommandBar } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscAdd, VscCheckAll, VscFilter, VscRefresh, VscSearch, VscSettingsGear } from 'react-icons/vsc'

export const title = 'Phone app bar'
export const description = 'Round icons on the bottom edge. "…" lifts the bar to show labels and the secondary commands.'

export default function Mobile() {
  const [last, setLast] = useState('nothing yet')
  const run = (name: string) => () => setLast(name)
  return (
    <div style={{ position: 'relative', height: 400, width: 360, maxWidth: '100%', border: '1px solid var(--mt-border)', overflow: 'hidden' }}>
      <p style={{ padding: '0 16px' }}>last command: {last}</p>
      <CommandBar
        platform="mobile"
        position="absolute"
        primary={[
          { key: 'new', label: 'new', icon: VscAdd, onClick: run('new') },
          { key: 'search', label: 'search', icon: VscSearch, onClick: run('search') },
          { key: 'select', label: 'select', icon: VscCheckAll, onClick: run('select') },
          { key: 'filter', label: 'filter', icon: VscFilter, onClick: run('filter') },
        ]}
        secondary={[
          { key: 'sync', label: 'sync', icon: VscRefresh, onClick: run('sync') },
          { key: 'settings', label: 'settings', icon: VscSettingsGear, onClick: run('settings') },
        ]}
      />
    </div>
  )
}
