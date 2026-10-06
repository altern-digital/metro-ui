import { Button, Section, Text } from '@altern-digital/metro-ui'
import { VscEdit } from 'react-icons/vsc'

export const title = 'With actions'

export default function WithActions() {
  return (
    <Section title="billing" actions={<Button variant="text" icon={VscEdit}>edit</Button>}>
      <Text tone="muted">paid monthly, next on 1 november.</Text>
    </Section>
  )
}
