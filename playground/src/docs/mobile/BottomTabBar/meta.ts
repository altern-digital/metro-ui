import type { ComponentDoc } from '../../types'

export default {
  name: 'BottomTabBar',
  category: 'mobile',
  summary: 'A row of icon-and-label tabs along the bottom of a phone screen.',
  platform: 'mobile',
  description:
    'The selected tab is lit in the accent with a bar along its top edge. Tabs can carry a badge, and with `href` they render as links through `linkComponent`. It pads itself for the home indicator (safe area).\n\nNavigationView uses it for its phone form. Use it directly when you only need tabs.\n\nIt is fixed to the viewport bottom by default. Inside a bounded box, such as these examples, set `position="absolute"` and give the box `position: relative` and a height. `static` puts it in the flow.',
  examples: ['Basic', 'Links'],
  props: [
    { name: 'items', type: 'BottomTabItem[]', required: true, description: '`{ key, label, icon?, badge?, href?, disabled? }` for each tab.' },
    { name: 'value', type: 'string | null', description: 'The selected key (controlled).' },
    { name: 'defaultValue', type: 'string | null', default: 'null', description: 'The selected key at first (uncontrolled).' },
    { name: 'onChange', type: '(key: string) => void', description: 'Called with the pressed key.' },
    { name: 'linkComponent', type: 'ElementType', default: "'a'", description: 'Renders tabs with `href`, e.g. Next.js `Link`.' },
    { name: 'position', type: "'fixed' | 'absolute' | 'static'", default: "'fixed'", description: 'Fixed to the viewport bottom, absolute to the positioned box bottom, or in the flow.' },
    { name: 'aria-label', type: 'string', description: 'Names the navigation landmark.' },
  ],
  accessibility: [
    'A `nav` landmark of buttons or links. The selected tab has `aria-current="page"`.',
    'Each tab is named by its label; give the bar an `aria-label` when a page has more than one navigation.',
  ],
} satisfies ComponentDoc
