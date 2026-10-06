import { Button, MenuFlyout } from '@altern-digital/metro-ui'

export const title = 'Basic'
export const description = 'A button with a few commands.'

export default function Basic() {
  return (
    <MenuFlyout
      items={[
        { key: 'new', label: 'new', onSelect: () => console.log('new') },
        { key: 'open', label: 'open…', onSelect: () => console.log('open') },
        { key: 'save', label: 'save', onSelect: () => console.log('save') },
      ]}
    >
      <Button>file</Button>
    </MenuFlyout>
  )
}
