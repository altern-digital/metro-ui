import { IconButton } from '@altern-digital/metro-ui'
import { VscRefresh, VscSettingsGear, VscTrash } from 'react-icons/vsc'

export const title = 'Basic'
export const description = 'Icon-only actions for toolbars. The label is the tooltip and the spoken name.'

export default function Basic() {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <IconButton icon={VscRefresh} label="refresh" />
      <IconButton icon={VscSettingsGear} label="settings" />
      <IconButton icon={VscTrash} label="delete" />
    </div>
  )
}
