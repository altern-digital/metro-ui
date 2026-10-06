import { Slider } from '@altern-digital/metro-ui'

export const title = 'Tooltip and steps'
export const description = 'Drag or focus the thumb to see the value.'

export default function Tooltip() {
  return (
    <div style={{ display: 'grid', gap: 32, maxWidth: 320, paddingTop: 32 }}>
      <Slider aria-label="brightness" tooltip defaultValue={60} formatValue={(v) => `${v}%`} />
      <Slider aria-label="text size" tooltip min={10} max={30} step={2} defaultValue={16} formatValue={(v) => `${v}px`} />
    </div>
  )
}
