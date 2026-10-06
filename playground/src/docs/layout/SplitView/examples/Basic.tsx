import { SplitView, Text } from '@altern-digital/metro-ui'

export const title = 'Resizable'
export const description = 'Drag the edge, or focus it and use the arrow keys.'

export default function Basic() {
  return (
    <div style={{ height: 240, border: '1px solid var(--mt-border)' }}>
      <SplitView resizable defaultPaneWidth={220} minPaneWidth={160} maxPaneWidth={400} pane={<Text as="div" style={{ padding: 16 }}>pane</Text>}>
        <Text as="div" style={{ padding: 16 }}>detail</Text>
      </SplitView>
    </div>
  )
}
