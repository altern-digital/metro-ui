import { Button, Stack, Text } from '@altern-digital/metro-ui'

export const title = 'A row with ends'
export const description = 'justify="between" pushes the buttons to the far side.'

export default function Row() {
  return (
    <Stack direction="row" align="center" justify="between">
      <Text>2 items selected</Text>
      <Stack direction="row" gap={2}>
        <Button>cancel</Button>
        <Button variant="accent">move</Button>
      </Stack>
    </Stack>
  )
}
