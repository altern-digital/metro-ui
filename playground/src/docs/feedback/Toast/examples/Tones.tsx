import { Button, useToast } from '@altern-digital/metro-ui'

export const title = 'Tones'
export const description = 'Each tone adds a coloured bar and a glyph.'

export default function Tones() {
  const toast = useToast()
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button onClick={() => toast.info({ title: 'update ready', description: 'Restart to finish installing.' })}>info</Button>
      <Button onClick={() => toast.success('saved')}>success</Button>
      <Button onClick={() => toast.warning({ title: 'battery low', description: '10% left.' })}>warning</Button>
      <Button onClick={() => toast.error({ title: 'could not send', description: 'Check your connection.' })}>error</Button>
      <Button variant="text" onClick={() => toast.dismissAll()}>dismiss all</Button>
    </div>
  )
}
