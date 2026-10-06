import { ListItem, ListView } from '@altern-digital/metro-ui'
import { VscCalendar, VscCloud, VscMail } from 'react-icons/vsc'

export const title = 'Basic'
export const description = 'Titles, muted subtitles, meta on the right and tiled squares at the start.'

export default function Basic() {
  return (
    <ListView header="recent" dividers style={{ maxWidth: 420 }}>
      <ListItem icon={VscMail} tone="blue" title="Quarterly numbers" subtitle="finance team" meta="9:41" />
      <ListItem icon={VscCalendar} tone="purple" title="Design review" subtitle="room 4 · 2:00 pm" meta="today" />
      <ListItem icon={VscCloud} tone="cyan" title="Backup finished" subtitle="12.4 GB" meta="mon" />
    </ListView>
  )
}
