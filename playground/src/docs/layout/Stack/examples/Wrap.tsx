import { Stack, Tag } from '@altern-digital/metro-ui'

export const title = 'Wrap'

export default function Wrap() {
  return (
    <Stack direction="row" gap={2} wrap style={{ maxWidth: 280 }}>
      {['design', 'research', 'frontend', 'backend', 'infra', 'docs', 'qa'].map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </Stack>
  )
}
