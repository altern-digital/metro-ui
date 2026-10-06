import { ContextMenu } from '@altern-digital/metro-ui'
import { VscCopy, VscEdit, VscTrash } from 'react-icons/vsc'

export const title = 'Basic'
export const description = 'Right-click the box, or press and hold it on a touch screen.'

export default function Basic() {
  return (
    <ContextMenu
      items={[
        { key: 'rename', label: 'rename', icon: VscEdit },
        { key: 'copy', label: 'copy', icon: VscCopy },
        { key: 'sep', divider: true },
        { key: 'delete', label: 'delete', icon: VscTrash, danger: true },
      ]}
    >
      <div tabIndex={0} style={{ display: 'grid', placeItems: 'center', width: 280, height: 120, border: '2px dashed currentColor' }}>
        right-click here
      </div>
    </ContextMenu>
  )
}
