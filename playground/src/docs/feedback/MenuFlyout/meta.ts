import type { ComponentDoc } from '../../types'

export default {
  name: 'MenuFlyout',
  category: 'feedback',
  summary: 'A list of commands that drops from a button; a bottom sheet on mobile.',
  platform: 'adaptive',
  description:
    'Give it `items` and one trigger element. On the desktop it is a flat flyout under the trigger, and submenus open to the side. On mobile it is a bottom sheet, and a submenu slides in with a back row.\n\nPicking an item runs its `onSelect`, closes every level and gives focus back to the trigger. Use `checked` for toggles and `divider` to separate groups.',
  related: ['ContextMenu', 'Popover', 'BottomSheet'],
  examples: ['Basic', 'Icons', 'Submenu', 'Checked'],
  props: [
    { name: 'items', type: 'MenuItem[]', required: true, description: 'The commands, in order.' },
    { name: 'children', type: 'ReactElement', required: true, description: 'The trigger: one element that takes a ref.' },
    { name: 'placement', type: 'Placement', default: "'bottom-start'", description: 'Where the desktop flyout opens; it flips when there is no room.' },
    { name: 'open', type: 'boolean', description: 'Controlled open state.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when uncontrolled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it opens or closes.' },
    { name: 'platform', type: "'auto' | 'mobile' | 'desktop'", default: "'auto'", description: 'Force the flyout or the sheet. `auto` follows the ConfigProvider.' },
    { name: 'aria-label', type: 'string', description: 'Names the menu for screen readers.' },
    { name: 'className', type: 'string', description: 'Added to the menu panel.' },
  ],
  extraProps: {
    MenuItem: [
      { name: 'key', type: 'string', required: true, description: 'Unique within its level.' },
      { name: 'label', type: 'ReactNode', description: 'The text.' },
      { name: 'icon', type: 'IconSource', description: 'An icon before the label.' },
      { name: 'shortcut', type: 'string', description: 'A key hint on the right, desktop only. It does not bind the key.' },
      { name: 'onSelect', type: '() => void', description: 'Runs when the item is picked.' },
      { name: 'danger', type: 'boolean', description: 'Red text for destructive commands.' },
      { name: 'disabled', type: 'boolean', description: 'Shown but cannot be picked.' },
      { name: 'checked', type: 'boolean', description: 'Shows a check and makes it a `menuitemcheckbox`.' },
      { name: 'divider', type: 'boolean', description: 'A separator line; other fields are ignored.' },
      { name: 'items', type: 'MenuItem[]', description: 'A submenu.' },
    ],
  },
  accessibility: [
    '`role="menu"` with `menuitem`, `menuitemcheckbox` and `separator` children; the trigger gets `aria-haspopup="menu"` and `aria-expanded`.',
    'Up and Down move, Home and End jump, a letter jumps to the next item starting with it, Right or Enter opens a submenu and Left closes it.',
    'Escape closes one level; Tab closes the whole menu.',
  ],
} satisfies ComponentDoc
