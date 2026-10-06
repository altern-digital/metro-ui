import { Badge, Text } from '@altern-digital/metro-ui'

export const title = 'Status dots'

export default function Dots() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {[
        ['success', 'api: operational'],
        ['warning', 'search: degraded'],
        ['danger', 'email: down'],
      ].map(([tone, text]) => (
        <div key={text} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge dot tone={tone} />
          <Text>{text}</Text>
        </div>
      ))}
    </div>
  )
}
