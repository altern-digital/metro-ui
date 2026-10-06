import { Button, Tooltip } from '@altern-digital/metro-ui'
import { VscRefresh, VscSave, VscTrash } from 'react-icons/vsc'

export const title = 'Icon buttons'
export const description = 'The common use: name icon-only commands for mouse users. Keep the aria-label too.'

export default function IconButtons() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Tooltip content="save (Ctrl+S)">
        <Button variant="text" icon={VscSave} aria-label="save" />
      </Tooltip>
      <Tooltip content="refresh (F5)">
        <Button variant="text" icon={VscRefresh} aria-label="refresh" />
      </Tooltip>
      <Tooltip content="delete">
        <Button variant="text" icon={VscTrash} aria-label="delete" />
      </Tooltip>
    </div>
  )
}
