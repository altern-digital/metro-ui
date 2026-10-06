import { Slider } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Live value and saved value'
export const description = '`onChange` for the preview, `onChangeEnd` for saving.'

export default function Controlled() {
  const [live, setLive] = useState(25)
  const [saved, setSaved] = useState(25)
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
      <Slider aria-label="opacity" value={live} onChange={setLive} onChangeEnd={setSaved} />
      <span>
        live {live} · saved {saved}
      </span>
    </div>
  )
}
