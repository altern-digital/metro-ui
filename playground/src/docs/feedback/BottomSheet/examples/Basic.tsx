import { BottomSheet, Button } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Basic'
export const description = 'Opens at half height. Drag the grip, tap the scrim or press Escape.'

export default function Basic() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>details</Button>
      <BottomSheet open={open} onOpenChange={setOpen} title="photo details">
        <p>Taken on 12 march at 18:04 with the rear camera. 4032 × 3024, 3.1 MB.</p>
      </BottomSheet>
    </>
  )
}
