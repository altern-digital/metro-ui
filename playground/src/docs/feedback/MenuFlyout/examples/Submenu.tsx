import { Button, MenuFlyout } from '@altern-digital/metro-ui'

export const title = 'Submenus'
export const description = 'An item with `items` opens a submenu: to the side on the desktop, as a drill-in page on mobile.'

export default function Submenu() {
  return (
    <MenuFlyout
      items={[
        { key: 'sort', label: 'sort by', items: [
          { key: 'name', label: 'name' },
          { key: 'date', label: 'date modified' },
          { key: 'size', label: 'size' },
        ] },
        { key: 'view', label: 'view', items: [
          { key: 'list', label: 'list' },
          { key: 'tiles', label: 'tiles' },
        ] },
        { key: 'refresh', label: 'refresh' },
      ]}
    >
      <Button>view options</Button>
    </MenuFlyout>
  )
}
