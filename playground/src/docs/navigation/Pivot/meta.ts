import type { ComponentDoc } from '../../types'

export default {
  name: 'Pivot',
  category: 'navigation',
  summary: 'Big lowercase headers over views that slide sideways, Windows Phone style.',
  platform: 'all',
  description:
    'The Windows Phone pivot: a row of large, thin headers with the current one lit and the rest muted. Picking a header slides the view in from the side it comes from. Under a finger the views can also be swiped left and right.\n\nWith `headerOnly` it is just the header row, for when the views live elsewhere (routing, a list filter).',
  examples: ['Basic', 'Controlled', 'HeaderOnly'],
  props: [
    { name: 'items', type: 'PivotItem[]', required: true, description: '`{ key, label, content?, disabled? }` for each view.' },
    { name: 'value', type: 'string', description: 'The selected key (controlled).' },
    { name: 'defaultValue', type: 'string', default: 'the first enabled item', description: 'The selected key at first (uncontrolled).' },
    { name: 'onChange', type: '(key: string) => void', description: 'Called with the picked key.' },
    { name: 'headerOnly', type: 'boolean', default: 'false', description: 'Render the headers only, no views.' },
    { name: 'swipe', type: 'boolean', default: 'true', description: 'Swipe between views with a finger.' },
    { name: 'size', type: "'md' | 'lg'", default: "'lg'", description: 'Header type size: `lg` is the phone pivot, `md` suits a desktop pane.' },
  ],
  accessibility: [
    'The headers are a `tablist` of `tab`s, each controlling its `tabpanel`.',
    'Left and Right move between headers and wrap; Home and End go to the first and last. Disabled headers are skipped.',
    'Only the selected tab is in the tab order.',
  ],
} satisfies ComponentDoc
