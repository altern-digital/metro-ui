import { AppBarButton } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscPin, VscStarFull } from 'react-icons/vsc'

export const title = 'Toggle'
export const description = 'Pass `pressed` and flip it on click. The circle stays filled while on.'

export default function Toggle() {
  const [favourite, setFavourite] = useState(true)
  const [pinned, setPinned] = useState(false)
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <AppBarButton icon={VscStarFull} label="favourite" pressed={favourite} onClick={() => setFavourite(!favourite)} />
      <AppBarButton icon={VscPin} label="pin" pressed={pinned} onClick={() => setPinned(!pinned)} />
    </div>
  )
}
