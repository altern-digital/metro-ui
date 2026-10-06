import { Button, Flyout } from '@altern-digital/metro-ui'

export const title = 'Placement'
export const description = 'Pick a side and an alignment. Flyout is the same component under its Windows name.'

export default function Placement() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Flyout content="above" placement="top">
        <Button>top</Button>
      </Flyout>
      <Flyout content="to the right" placement="right-start">
        <Button>right-start</Button>
      </Flyout>
      <Flyout content="under, aligned to the end" placement="bottom-end">
        <Button>bottom-end</Button>
      </Flyout>
    </div>
  )
}
