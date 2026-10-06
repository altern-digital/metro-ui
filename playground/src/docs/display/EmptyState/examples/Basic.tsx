import { Button, EmptyState } from '@altern-digital/metro-ui'
import { VscAdd, VscInbox } from 'react-icons/vsc'

export const title = 'Basic'

export default function Basic() {
  return (
    <EmptyState
      icon={VscInbox}
      title="no messages"
      description="mail you receive lands here."
      action={<Button variant="accent" icon={VscAdd}>compose</Button>}
    />
  )
}
