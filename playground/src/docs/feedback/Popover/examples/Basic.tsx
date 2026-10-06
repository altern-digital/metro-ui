import { Button, Popover } from '@altern-digital/metro-ui'

export const title = 'Basic'
export const description = 'Press the trigger to open the panel; Escape or a press outside closes it.'

export default function Basic() {
  return (
    <Popover content={<p style={{ margin: 0, maxWidth: 240 }}>Saved to your drafts. You can find it under drafts on any device.</p>}>
      <Button>details</Button>
    </Popover>
  )
}
