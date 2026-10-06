import type { ComponentDoc } from '../../types'

export default {
  name: 'Badge',
  category: 'display',
  summary: 'A count or a dot, on its own or on the corner of something.',
  platform: 'all',
  description:
    'Badge shows a number, like unread mail, or a dot that only says “something new”. Wrap an icon or a button in it and it sits on the top-right corner.\n\nCounts above `max` show as `99+`. A zero count hides the badge unless `showZero` is set.',
  examples: ['Counts', 'OnSomething', 'Dots'],
  props: [
    { name: 'count', type: 'number', description: 'The number to show.' },
    { name: 'max', type: 'number', default: '99', description: 'Counts above this show as `max+`.' },
    { name: 'showZero', type: 'boolean', default: 'false', description: 'Show the badge when the count is 0.' },
    { name: 'dot', type: 'boolean', default: 'false', description: 'A small dot instead of a number.' },
    { name: 'tone', type: "'accent' | 'danger' | 'warning' | 'success' | 'info' | Tone", default: "'accent'", description: 'The fill.' },
    { name: 'label', type: 'string', description: 'What the badge means, for screen readers, e.g. `3 unread`.' },
    { name: 'children', type: 'ReactNode', description: 'What the badge sits on.' },
  ],
  accessibility: [
    'With a `label` the badge is a `status`, so changes are announced.',
    'A dot with no label is hidden from screen readers; say what it means in the label or in the wrapped control.',
  ],
} satisfies ComponentDoc
