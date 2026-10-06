import { Button, MenuFlyout } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Toggles'
export const description = 'Use `checked` for on/off commands. The menu closes after each pick.'

export default function Checked() {
  const [show, setShow] = useState({ hidden: false, extensions: true, preview: true })
  const toggle = (key: keyof typeof show) => () => setShow((s) => ({ ...s, [key]: !s[key] }))
  return (
    <MenuFlyout
      items={[
        { key: 'hidden', label: 'hidden files', checked: show.hidden, onSelect: toggle('hidden') },
        { key: 'extensions', label: 'file extensions', checked: show.extensions, onSelect: toggle('extensions') },
        { key: 'preview', label: 'preview pane', checked: show.preview, onSelect: toggle('preview') },
      ]}
    >
      <Button>show</Button>
    </MenuFlyout>
  )
}
