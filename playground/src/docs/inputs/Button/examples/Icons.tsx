import { Button } from '@altern-digital/metro-ui'
import { VscAdd, VscCloudDownload, VscSave, VscTrash } from 'react-icons/vsc'

export const title = 'With icons'
export const description = 'Pass any icon component or element. With no label, give it an aria-label.'

export default function Icons() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button variant="accent" icon={VscSave}>save</Button>
      <Button iconEnd={VscCloudDownload}>download</Button>
      <Button variant="text" icon={VscAdd}>new item</Button>
      <Button icon={VscTrash} aria-label="delete" />
    </div>
  )
}
