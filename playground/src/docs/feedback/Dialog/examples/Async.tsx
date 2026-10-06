import { Button, Dialog } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Waiting on an action'
export const description = 'Return a promise from onClick and the button loads until it settles. Return false to stay open.'

export default function Async() {
  const [open, setOpen] = useState(false)
  const [tries, setTries] = useState(0)
  const sync = async () => {
    await new Promise((r) => setTimeout(r, 1200))
    setTries((t) => t + 1)
    return tries > 0 // the first try "fails" and keeps the dialog open
  }
  return (
    <>
      <Button onClick={() => setOpen(true)}>sync now</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="sync your settings?"
        dismissible={false}
        actions={[{ label: tries ? 'try again' : 'sync', variant: 'accent', onClick: sync }, { label: 'cancel' }]}
      >
        {tries ? 'That did not work. Try again?' : 'Your theme, passwords and start layout go to your other devices.'}
      </Dialog>
    </>
  )
}
