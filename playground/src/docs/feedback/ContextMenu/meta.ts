import type { ComponentDoc } from '../../types'

export default {
  name: 'ContextMenu',
  category: 'feedback',
  summary: 'The MenuFlyout for a right click or a long press.',
  platform: 'adaptive',
  description:
    'Wrap a region and give it `items`. A right click opens the menu at the pointer; a long press (500ms) on touch opens it as a bottom sheet. The context-menu key or Shift+F10 opens it at the corner of the focused element.\n\nItems are the same `MenuItem` objects as MenuFlyout. Use it for shortcuts only: every command should also be reachable another way.',
  related: ['MenuFlyout'],
  examples: ['Basic', 'Disabled'],
  props: [
    { name: 'items', type: 'MenuItem[]', required: true, description: 'The commands, see MenuFlyout.' },
    { name: 'children', type: 'ReactElement', required: true, description: 'The region: one element that takes a ref.' },
    { name: 'open', type: 'boolean', description: 'Controlled open state.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when uncontrolled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it opens or closes.' },
    { name: 'platform', type: "'auto' | 'mobile' | 'desktop'", default: "'auto'", description: 'Force the flyout or the sheet.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Leave the browser menu alone.' },
    { name: 'aria-label', type: 'string', description: 'Names the menu.' },
    { name: 'className', type: 'string', description: 'Added to the menu panel.' },
  ],
  accessibility: [
    'Opens from the keyboard with the context-menu key or Shift+F10, and focuses the first item.',
    'Keyboard and focus behave as in MenuFlyout; focus goes back to the region when it closes.',
  ],
} satisfies ComponentDoc
