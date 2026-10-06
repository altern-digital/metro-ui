import { Button, Popover } from '@altern-digital/metro-ui'
import { VscAccount } from 'react-icons/vsc'

export const title = 'On hover'
export const description = 'A preview that opens on hover or keyboard focus. A tap toggles it.'

export default function Hover() {
  return (
    <Popover
      trigger="hover"
      placement="bottom"
      content={
        <div style={{ display: 'grid', gap: 4 }}>
          <strong>Ana Lima</strong>
          <span>ana@contoso.com</span>
        </div>
      }
    >
      <Button variant="text" icon={VscAccount}>ana lima</Button>
    </Popover>
  )
}
