import { Button, EmptyState, PageStates } from '@altern-digital/metro-ui'
import { VscAdd, VscFolder } from 'react-icons/vsc'

export const title = 'Your own empty state'

export default function Custom() {
  return (
    <PageStates
      state="empty"
      empty={
        <EmptyState
          icon={VscFolder}
          title="no projects"
          description="projects you create or join show up here."
          action={<Button variant="accent" icon={VscAdd}>new project</Button>}
        />
      }
    />
  )
}
