import { Tag } from '@altern-digital/metro-ui'
import { VscCheck, VscWarning } from 'react-icons/vsc'

export const title = 'Outline and icons'

export default function Outline() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Tag variant="outline">neutral</Tag>
      <Tag variant="outline" tone="success" icon={VscCheck}>passing</Tag>
      <Tag variant="outline" tone="warning" icon={VscWarning}>flaky</Tag>
      <Tag variant="outline" tone="orange">v2</Tag>
    </div>
  )
}
