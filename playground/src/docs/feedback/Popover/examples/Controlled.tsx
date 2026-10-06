import { Button, Popover } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Controlled'
export const description = 'Keep the open state yourself, here to close the panel from a button inside it.'

export default function Controlled() {
  const [open, setOpen] = useState(false)
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      aria-label="rename"
      content={
        <div style={{ display: 'grid', gap: 8 }}>
          <span>Rename this file?</span>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="accent" onClick={() => setOpen(false)}>rename</Button>
            <Button onClick={() => setOpen(false)}>cancel</Button>
          </div>
        </div>
      }
    >
      <Button>rename…</Button>
    </Popover>
  )
}
