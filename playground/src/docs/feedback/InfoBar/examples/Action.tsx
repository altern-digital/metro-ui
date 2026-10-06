import { Button, InfoBar } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Action and close'
export const description = 'Add a button at the end and let people dismiss it. You remove it in onClose.'

export default function Action() {
  const [visible, setVisible] = useState(true)
  if (!visible) return <Button onClick={() => setVisible(true)}>show again</Button>
  return (
    <InfoBar
      severity="warning"
      title="update required"
      message="This version stops working on friday."
      action={<Button size="sm">update now</Button>}
      closable
      onClose={() => setVisible(false)}
    />
  )
}
