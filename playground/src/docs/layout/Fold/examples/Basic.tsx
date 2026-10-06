import { Fold, Text } from '@altern-digital/metro-ui'

export const title = 'Fold'

export default function Basic() {
  return (
    <div>
      <Fold title="what is synced?" defaultOpen>
        <Text tone="muted">settings, passwords and your reading list.</Text>
      </Fold>
      <Fold title="can i sync on a metered connection?">
        <Text tone="muted">only when you allow it in data usage.</Text>
      </Fold>
    </div>
  )
}
