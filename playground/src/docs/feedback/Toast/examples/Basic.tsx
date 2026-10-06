import { Button, useToast } from '@altern-digital/metro-ui'

export const title = 'Basic'
export const description = 'Pass a string for a one-line toast.'

export default function Basic() {
  const toast = useToast()
  return <Button onClick={() => toast.show('copied to clipboard')}>copy</Button>
}
