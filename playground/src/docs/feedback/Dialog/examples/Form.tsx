import { Button, Dialog } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Size and a custom footer'
export const description = 'A wider dialog with your own content and footer. On mobile it becomes a full-screen page.'

export default function Form() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>add account</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        size="lg"
        title="add an account"
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="accent" onClick={() => setOpen(false)}>sign in</Button>
            <Button onClick={() => setOpen(false)}>cancel</Button>
          </div>
        }
      >
        <div style={{ display: 'grid', gap: 8 }}>
          <label style={{ display: 'grid', gap: 4 }}>
            email
            <input type="email" autoFocus />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>
            password
            <input type="password" />
          </label>
        </div>
      </Dialog>
    </>
  )
}
