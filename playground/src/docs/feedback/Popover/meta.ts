import type { ComponentDoc } from '../../types'

export default {
  name: 'Popover',
  category: 'feedback',
  summary: 'A flat flyout panel beside its trigger, also exported as Flyout.',
  platform: 'all',
  description:
    'Wrap one trigger element (a Button) and give the panel as `content`. It opens below the trigger by default, flips to the other side when there is no room and stays inside the viewport.\n\nIt closes on Escape, on a press outside and on a second press of the trigger, and gives focus back to the trigger. `trigger="hover"` opens it on hover or focus for previews; `trigger="manual"` leaves it to `open`.',
  related: ['Flyout'],
  examples: ['Basic', 'Placement', 'Hover', 'Controlled'],
  props: [
    { name: 'content', type: 'ReactNode', required: true, description: 'What the panel shows.' },
    { name: 'children', type: 'ReactElement', required: true, description: 'The trigger: one element that takes a ref.' },
    { name: 'open', type: 'boolean', description: 'Controlled open state.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when uncontrolled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it opens or closes.' },
    { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right' | `${side}-start` | `${side}-end`", default: "'bottom-start'", description: 'Preferred side and alignment; it flips when there is no room.' },
    { name: 'trigger', type: "'click' | 'hover' | 'manual'", default: "'click'", description: 'What opens it.' },
    { name: 'offset', type: 'number', default: '4', description: 'Gap to the trigger in px.' },
    { name: 'matchWidth', type: 'boolean', default: 'false', description: 'At least as wide as the trigger.' },
    { name: 'autoFocus', type: 'boolean', default: "trigger === 'click'", description: 'Move focus into the panel when it opens.' },
    { name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Escape closes it.' },
    { name: 'closeOnOutsideClick', type: 'boolean', default: 'true', description: 'A press outside closes it.' },
  ],
  accessibility: [
    'The trigger gets `aria-expanded`, `aria-haspopup` and, while open, `aria-controls`.',
    'The panel is `role="dialog"` by default; pass `role` and `aria-label` to describe it.',
    'Escape closes only the topmost overlay, and focus returns to the trigger.',
  ],
} satisfies ComponentDoc
