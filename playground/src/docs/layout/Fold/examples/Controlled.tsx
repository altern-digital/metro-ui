import { Button, Fold, Text } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Controlled'

export default function Controlled() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button onClick={() => setOpen((o) => !o)}>{open ? 'close' : 'open'} from outside</Button>
      <Fold title="details" open={open} onOpenChange={setOpen}>
        <Text tone="muted">opened from the button or the heading.</Text>
      </Fold>
    </div>
  )
}
