import { Button, MenuFlyout } from '@altern-digital/metro-ui'
import { VscCopy, VscEdit, VscEllipsis, VscTrash } from 'react-icons/vsc'

export const title = 'Icons, shortcuts and danger'
export const description = 'Icons sit before the label, key hints on the right. A divider sets the destructive command apart.'

export default function Icons() {
  return (
    <MenuFlyout
      aria-label="item actions"
      items={[
        { key: 'rename', label: 'rename', icon: VscEdit, shortcut: 'F2' },
        { key: 'copy', label: 'duplicate', icon: VscCopy, shortcut: 'Ctrl+D' },
        { key: 'share', label: 'share', disabled: true },
        { key: 'sep', divider: true },
        { key: 'delete', label: 'delete', icon: VscTrash, danger: true, shortcut: 'Del' },
      ]}
    >
      <Button variant="text" icon={VscEllipsis} aria-label="more" />
    </MenuFlyout>
  )
}
