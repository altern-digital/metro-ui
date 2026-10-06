import type { ComponentDoc } from '../../types'

export default {
  name: 'Text',
  category: 'layout',
  summary: 'Body text on the type scale, with tone, weight, mono and truncation.',
  platform: 'all',
  description:
    'Text puts a run of copy on the Metro type scale without writing CSS. It renders a `span` unless `as` says otherwise, so it fits inline or, with `as="p"`, as a paragraph.\n\nTones are the status colours plus `muted` and `accent`. Body text is not lowercased.',
  examples: ['Sizes', 'Tones', 'Truncate'],
  props: [
    { name: 'size', type: "'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'display'", description: 'A step on the type scale, 11px to 42px. Default: inherited.' },
    { name: 'tone', type: "'default' | 'muted' | 'accent' | 'danger' | 'success' | 'warning'", default: "'default'", description: 'The colour.' },
    { name: 'weight', type: '200 | 300 | 400 | 600', description: 'Font weight. Default: inherited.' },
    { name: 'mono', type: 'boolean', default: 'false', description: 'Use the monospace face.' },
    { name: 'truncate', type: 'boolean', default: 'false', description: 'One line, cut with an ellipsis.' },
    { name: 'as', type: 'ElementType', default: "'span'", description: 'The element to render.' },
    { name: 'children', type: 'ReactNode', description: 'The text.' },
  ],
  accessibility: ['Truncated text is still read in full; add a `title` if sighted users need the rest too.'],
} satisfies ComponentDoc
