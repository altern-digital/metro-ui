import { Button, Page, Text } from '@altern-digital/metro-ui'
import { VscAdd } from 'react-icons/vsc'

export const title = 'Title, subtitle and actions'

export default function Basic() {
  return (
    <div style={{ height: 280, border: '1px solid var(--mt-border)' }}>
      <Page title="projects" subtitle="12 active" actions={<Button variant="accent" icon={VscAdd}>new</Button>}>
        <Text tone="muted">the body scrolls; the header stays.</Text>
      </Page>
    </div>
  )
}
