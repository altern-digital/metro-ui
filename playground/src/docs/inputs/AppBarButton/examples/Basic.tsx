import { AppBarButton } from '@altern-digital/metro-ui'
import { VscAdd, VscEdit, VscSearch, VscTrash } from 'react-icons/vsc'

export const title = 'An app bar'

export default function Basic() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
      <AppBarButton icon={VscAdd} label="new" />
      <AppBarButton icon={VscEdit} label="edit" />
      <AppBarButton icon={VscSearch} label="search" />
      <AppBarButton icon={VscTrash} label="delete" disabled />
    </div>
  )
}
