import { Button, Tooltip } from '@altern-digital/metro-ui'

export const title = 'Basic'
export const description = 'Hover or focus the button.'

export default function Basic() {
  return (
    <Tooltip content="sends the draft to everyone on the list">
      <Button variant="accent">send</Button>
    </Tooltip>
  )
}
