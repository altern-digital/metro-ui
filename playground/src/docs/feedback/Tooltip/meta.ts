import type { ComponentDoc } from '../../types'

export default {
  name: 'Tooltip',
  category: 'feedback',
  summary: 'A short label that appears after hovering or focusing an element.',
  platform: 'desktop',
  description:
    'Wrap one element and give the text as `content`. It shows after `delay` on hover, and at once on keyboard focus. It hides on leave, blur, a press or Escape.\n\nTouch screens have no hover, so under a coarse pointer it renders only the child. Never put information or controls in a tooltip that are not available elsewhere.',
  related: ['Popover'],
  examples: ['Basic', 'Placement', 'IconButtons'],
  props: [
    { name: 'content', type: 'ReactNode', required: true, description: 'The label. Empty content renders only the child.' },
    { name: 'children', type: 'ReactElement', required: true, description: 'The element it describes: one element that takes a ref.' },
    { name: 'placement', type: 'Placement', default: "'bottom'", description: 'Preferred side; it flips when there is no room.' },
    { name: 'delay', type: 'number', default: '500', description: 'Hover delay in ms.' },
    { name: 'className', type: 'string', description: 'Added to the tooltip.' },
  ],
  accessibility: [
    'The tooltip is `role="tooltip"` and the child gets `aria-describedby` while it shows.',
    'Icon-only buttons still need their own `aria-label`; the tooltip only describes.',
    'Escape hides it without closing anything else.',
  ],
} satisfies ComponentDoc
