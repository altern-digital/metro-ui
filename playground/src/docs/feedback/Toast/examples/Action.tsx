import { Button, useToast } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscArchive } from 'react-icons/vsc'

export const title = 'With an action'
export const description = 'Offer an undo. Pressing the action also dismisses the toast.'

export default function Action() {
  const toast = useToast()
  const [archived, setArchived] = useState(0)
  const archive = () => {
    setArchived((n) => n + 1)
    toast.show({ title: 'conversation archived', icon: VscArchive, action: { label: 'undo', onClick: () => setArchived((n) => n - 1) } })
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <Button onClick={archive}>archive</Button>
      <span>archived: {archived}</span>
    </div>
  )
}
