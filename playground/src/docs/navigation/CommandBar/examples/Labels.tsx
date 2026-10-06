import { CommandBar } from '@altern-digital/metro-ui'
import { VscCopy, VscSave, VscShare } from 'react-icons/vsc'

export const title = 'Label placement'
export const description = 'Labels on the right, below, or hidden. Hidden labels still name the buttons for screen readers and tooltips.'

const primary = [
  { key: 'save', label: 'save', icon: VscSave },
  { key: 'copy', label: 'copy', icon: VscCopy },
  { key: 'share', label: 'share', icon: VscShare },
]

export default function Labels() {
  return (
    <div style={{ position: 'relative', height: 200, display: 'grid', gap: 12, alignContent: 'start', border: '1px solid var(--mt-border)' }}>
      <CommandBar platform="desktop" labels="right" primary={primary} />
      <CommandBar platform="desktop" labels="bottom" primary={primary} />
      <CommandBar platform="desktop" labels="collapsed" primary={primary} />
    </div>
  )
}
