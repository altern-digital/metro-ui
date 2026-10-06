import { BottomSheet, Button } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Snap points and fit'
export const description = 'Choose the heights it rests at, or let it fit its content.'

export default function Snap() {
  const [open, setOpen] = useState<'snap' | 'fit' | null>(null)
  const close = () => setOpen(null)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button onClick={() => setOpen('snap')}>three heights</Button>
      <Button onClick={() => setOpen('fit')}>fit content</Button>
      <BottomSheet open={open === 'snap'} onOpenChange={(o) => !o && close()} title="comments" snapPoints={[0.3, 0.6, 0.95]}>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i}>comment {i + 1}</p>
        ))}
      </BottomSheet>
      <BottomSheet open={open === 'fit'} onOpenChange={(o) => !o && close()} title="share" fit>
        <p>Only as tall as this line.</p>
      </BottomSheet>
    </div>
  )
}
