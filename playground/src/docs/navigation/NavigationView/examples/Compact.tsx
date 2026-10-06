import { NavigationView, Segmented } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscCalendar, VscHome, VscMail, VscSettingsGear } from 'react-icons/vsc'

export const title = 'Compact and minimal'
export const description = 'The tablet forms: an icon strip, or just a menu button. Either one lays the full pane over the content.'

export default function Compact() {
  const [mode, setMode] = useState<'compact' | 'minimal'>('compact')
  const [page, setPage] = useState('home')
  return (
    <div>
      <Segmented
        value={mode}
        onChange={(v) => setMode(v as 'compact' | 'minimal')}
        options={[
          { value: 'compact', label: 'compact' },
          { value: 'minimal', label: 'minimal' },
        ]}
      />
      <div style={{ position: 'relative', height: 360, marginTop: 12, border: '1px solid var(--mt-border)', overflow: 'hidden' }}>
        <NavigationView
          mode={mode}
          position="absolute"
          header="calendar"
          value={page}
          onChange={setPage}
          items={[
            { key: 'home', label: 'home', icon: VscHome },
            { key: 'mail', label: 'mail', icon: VscMail, badge: 3 },
            { key: 'calendar', label: 'calendar', icon: VscCalendar },
          ]}
          footerItems={[{ key: 'settings', label: 'settings', icon: VscSettingsGear }]}
        >
          <div style={{ padding: 24 }}>{page}</div>
        </NavigationView>
      </div>
    </div>
  )
}
