import { Button, Dialog } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Basic'
export const description = 'A title, a sentence and two buttons. Each button closes it.'

export default function Basic() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>open dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="turn on location?"
        actions={[
          { label: 'turn on', variant: 'accent', onClick: () => console.log('on') },
          { label: 'not now' },
        ]}
      >
        Apps can use your location to show nearby places and the weather.
      </Dialog>
    </>
  )
}
