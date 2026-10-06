import type { ComponentDoc } from '../../types'

export default {
  name: 'Title',
  category: 'layout',
  summary: 'Thin, lowercase Segoe-style headings in four levels, with a subtitle.',
  platform: 'all',
  description:
    'Level 1 is the large, light page title of the Metro hubs. Levels 2 to 4 get smaller and heavier, so the hierarchy reads from size and weight together.\n\nThe heading element follows the level (`h1`–`h4`); pass `as` when the outline needs a different one. `Subtitle` is the muted line that sits under a title.',
  related: ['Subtitle'],
  examples: ['Levels', 'WithSubtitle'],
  props: [
    { name: 'level', type: '1 | 2 | 3 | 4', default: '1', description: 'Size and weight, and the heading element unless `as` is set.' },
    { name: 'as', type: 'ElementType', default: '`h${level}`', description: 'The element to render.' },
    { name: 'keepCase', type: 'boolean', default: 'false', description: 'Keep the text as written instead of lowercasing it.' },
    { name: 'children', type: 'ReactNode', description: 'The title.' },
  ],
  extraProps: {
    Subtitle: [
      { name: 'as', type: 'ElementType', default: "'p'", description: 'The element to render.' },
      { name: 'children', type: 'ReactNode', description: 'The subtitle.' },
    ],
  },
  accessibility: ['A real heading element, so it shows in the document outline. Use `as` to keep levels in order without changing the look.'],
} satisfies ComponentDoc
