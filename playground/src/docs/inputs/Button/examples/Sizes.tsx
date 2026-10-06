import { Button } from '@altern-digital/metro-ui'

export const title = 'Sizes'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      <Button size="sm">small</Button>
      <Button size="md">medium</Button>
      <Button size="lg" variant="accent">large</Button>
      <Button block variant="primary">block</Button>
    </div>
  )
}
