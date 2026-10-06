import { CommandBar } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscAdd, VscEdit, VscPinned, VscRefresh, VscSettingsGear, VscTrash } from 'react-icons/vsc'

export const title = 'Desktop'
export const description = 'Primary commands as buttons, a pin toggle, and the rest behind "…".'

export default function Desktop() {
  const [pinned, setPinned] = useState(false)
  const [last, setLast] = useState('nothing yet')
  return (
    <div style={{ position: 'relative', height: 200, border: '1px solid var(--mt-border)' }}>
      <CommandBar
        platform="desktop"
        content={<strong style={{ padding: '0 12px' }}>documents</strong>}
        primary={[
          { key: 'new', label: 'new', icon: VscAdd, onClick: () => setLast('new') },
          { key: 'edit', label: 'edit', icon: VscEdit, onClick: () => setLast('edit') },
          { key: 'pin', label: 'pin', icon: VscPinned, toggled: pinned, onClick: () => setPinned(!pinned) },
        ]}
        secondary={[
          { key: 'refresh', label: 'refresh', icon: VscRefresh, onClick: () => setLast('refresh') },
          { key: 'delete', label: 'delete', icon: VscTrash, onClick: () => setLast('delete') },
          { key: 'settings', label: 'settings', icon: VscSettingsGear, onClick: () => setLast('settings') },
        ]}
      />
      <p style={{ padding: '0 12px' }}>last command: {last}</p>
    </div>
  )
}
