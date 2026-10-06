import { BottomSheet, Button } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Footer and no dismiss'
export const description = 'A footer stays pinned while the content scrolls. With dismissible={false} only the buttons close it.'

export default function Footer() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>terms</Button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="terms of use"
        dismissible={false}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="accent" onClick={() => setOpen(false)}>accept</Button>
            <Button onClick={() => setOpen(false)}>decline</Button>
          </div>
        }
      >
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i}>Section {i + 1}. You agree to use the app as intended and keep your account details safe.</p>
        ))}
      </BottomSheet>
    </>
  )
}
