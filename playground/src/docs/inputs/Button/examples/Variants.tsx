import { Button } from '@altern-digital/metro-ui'

export const title = 'Variants'
export const description = 'From quiet to loud. Keep one accent button per screen.'

export default function Variants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button>default</Button>
      <Button variant="primary">primary</Button>
      <Button variant="accent">accent</Button>
      <Button variant="text">text</Button>
      <Button variant="danger">delete</Button>
    </div>
  )
}
