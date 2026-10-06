import { Button, useDialog } from '@altern-digital/metro-ui'
import { VscTrash } from 'react-icons/vsc'

export const title = 'useDialog: confirm and alert'
export const description = 'Ask in the middle of a handler and await the answer. `danger` makes OK red and starts focus on cancel.'

export default function Confirm() {
  const dialog = useDialog()
  const remove = async () => {
    const ok = await dialog.confirm({ title: 'delete 3 files?', content: 'They go to the recycle bin.', okText: 'delete', danger: true })
    if (ok) await dialog.alert({ title: 'deleted', content: '3 files are in the recycle bin.' })
  }
  return (
    <Button variant="danger" icon={VscTrash} onClick={remove}>
      delete
    </Button>
  )
}
