import type { ComponentDoc } from '../../types'

export default {
  name: 'EmptyState',
  category: 'display',
  summary: 'What a list or a screen shows when there is nothing in it yet.',
  platform: 'all',
  description:
    'An empty state says what would be here and how to get some: a large muted icon, a light lowercase title, a line of explanation and, usually, the one action that fills it.\n\nCentred by default; `align="start"` lines it up with the content of a page.',
  examples: ['Basic', 'Start'],
  props: [
    { name: 'icon', type: 'IconSource', description: 'A large muted icon above the title.' },
    { name: 'title', type: 'ReactNode', description: 'What is missing.' },
    { name: 'description', type: 'ReactNode', description: 'Why, or what to do.' },
    { name: 'action', type: 'ReactNode', description: 'A button that fills it.' },
    { name: 'align', type: "'center' | 'start'", default: "'center'", description: 'Centred, or lined up on the left.' },
    { name: 'keepCase', type: 'boolean', default: 'false', description: 'Keep the title as written.' },
    { name: 'children', type: 'ReactNode', description: 'Anything else, under the action.' },
  ],
  accessibility: ['The icon is hidden from screen readers; the title carries the meaning.'],
} satisfies ComponentDoc
