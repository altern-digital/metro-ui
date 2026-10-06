import { Button, Tooltip } from '@altern-digital/metro-ui'

export const title = 'Placement'
export const description = 'Prefer a side; it flips at the edge of the window.'

export default function Placement() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Tooltip content="above" placement="top">
        <Button>top</Button>
      </Tooltip>
      <Tooltip content="on the right" placement="right">
        <Button>right</Button>
      </Tooltip>
      <Tooltip content="below, right away" placement="bottom" delay={0}>
        <Button>no delay</Button>
      </Tooltip>
    </div>
  )
}
