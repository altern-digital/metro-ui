import { Slider } from '@altern-digital/metro-ui'

export const title = 'Basic'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 320 }}>
      <Slider aria-label="volume" defaultValue={40} />
      <Slider aria-label="disabled" defaultValue={70} disabled />
    </div>
  )
}
