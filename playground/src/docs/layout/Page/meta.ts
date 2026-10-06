import type { ComponentDoc } from '../../types'

export default {
  name: 'Page',
  category: 'layout',
  summary: 'A screen: big lowercase title, back button, actions, an optional pivot and a scrolling body.',
  platform: 'all',
  description:
    'Page lays out one screen the way Metro apps do: a back arrow, the title in light display type, a subtitle under it and actions on the right. A `pivot` (tabs, a Pivot) sits between the header and the body. Only the body scrolls, so the title stays put.\n\nThe padding drops from 24px to 16px on compact screens. `bleed` removes it from the body, for a list or a map that runs edge to edge.',
  examples: ['Basic', 'WithBack', 'Bleed'],
  props: [
    { name: 'title', type: 'ReactNode', description: 'The page title, at Title level 1.' },
    { name: 'subtitle', type: 'ReactNode', description: 'A muted line under the title.' },
    { name: 'actions', type: 'ReactNode', description: 'Buttons on the right of the header.' },
    { name: 'onBack', type: '() => void', description: 'Show a back arrow that calls this.' },
    { name: 'back', type: 'ReactNode', description: 'Your own back control, e.g. a router link, in place of the arrow.' },
    { name: 'pivot', type: 'ReactNode', description: 'Tabs or a pivot between the header and the body.' },
    { name: 'bleed', type: 'boolean', default: 'false', description: 'No padding around the body.' },
    { name: 'keepCase', type: 'boolean', default: 'false', description: 'Keep the title as written instead of lowercasing it.' },
    { name: 'children', type: 'ReactNode', description: 'The body.' },
  ],
  accessibility: [
    'The title is an `h1`.',
    'The back arrow is a button named from the locale (`back`).',
  ],
} satisfies ComponentDoc
