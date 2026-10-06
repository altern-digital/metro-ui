import { Badge, Button } from '@altern-digital/metro-ui'
import { VscBell, VscMail } from 'react-icons/vsc'

export const title = 'On a control'

export default function OnSomething() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Badge count={5} label="5 unread">
        <Button icon={VscMail} aria-label="mail, 5 unread" />
      </Badge>
      <Badge dot tone="danger">
        <Button icon={VscBell} aria-label="notifications, new" />
      </Badge>
    </div>
  )
}
