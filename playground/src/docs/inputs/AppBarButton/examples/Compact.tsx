import { AppBarButton } from '@altern-digital/metro-ui'
import { VscArrowLeft, VscArrowRight, VscRefresh } from 'react-icons/vsc'

export const title = 'Compact'
export const description = 'Without captions, for a minimised app bar. The caption becomes the tooltip.'

export default function Compact() {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <AppBarButton icon={VscArrowLeft} label="back" compact />
      <AppBarButton icon={VscRefresh} label="refresh" compact />
      <AppBarButton icon={VscArrowRight} label="forward" compact />
    </div>
  )
}
