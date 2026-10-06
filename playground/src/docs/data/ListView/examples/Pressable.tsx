import { ListItem, ListView } from '@altern-digital/metro-ui'
import { VscBell, VscChevronRight, VscSettingsGear } from 'react-icons/vsc'

export const title = 'Pressable rows'
export const description = 'Rows with onClick are buttons; with href they are links.'

export default function Pressable() {
  return (
    <ListView header="settings" style={{ maxWidth: 420 }}>
      <ListItem icon={VscSettingsGear} title="system" subtitle="display, sound, storage" trailing={<VscChevronRight />} onClick={() => {}} />
      <ListItem icon={VscBell} title="notifications" subtitle="on" trailing={<VscChevronRight />} href="#notifications" />
      <ListItem title="about" subtitle="version 8.1" disabled onClick={() => {}} />
    </ListView>
  )
}
