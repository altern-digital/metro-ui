import { Button, useDialog } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'useDialog: prompt'
export const description = 'Ask for one line of text. It resolves to the text, or null when cancelled.'

export default function Prompt() {
  const dialog = useDialog()
  const [name, setName] = useState('untitled')
  const rename = async () => {
    const next = await dialog.prompt({ title: 'rename', defaultValue: name, okText: 'rename' })
    if (next) setName(next)
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <span>{name}</span>
      <Button onClick={rename}>rename…</Button>
    </div>
  )
}
