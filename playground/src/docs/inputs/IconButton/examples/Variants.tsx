import { IconButton } from '@altern-digital/metro-ui'
import { VscAdd } from 'react-icons/vsc'

export const title = 'Variants'

export default function Variants() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <IconButton icon={VscAdd} label="add (text)" />
      <IconButton icon={VscAdd} label="add (default)" variant="default" />
      <IconButton icon={VscAdd} label="add (accent)" variant="accent" />
      <IconButton icon={VscAdd} label="add (disabled)" variant="default" disabled />
    </div>
  )
}
