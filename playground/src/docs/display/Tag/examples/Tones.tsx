import { Tag } from '@altern-digital/metro-ui'

export const title = 'Tones'

export default function Tones() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Tag>draft</Tag>
      <Tag tone="accent">new</Tag>
      <Tag tone="success">live</Tag>
      <Tag tone="warning">pending</Tag>
      <Tag tone="danger">failed</Tag>
      <Tag tone="teal">design</Tag>
      <Tag tone="purple">research</Tag>
    </div>
  )
}
