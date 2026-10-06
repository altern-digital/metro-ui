import type { ComponentDoc } from '../../types'

export default {
  name: 'Tag',
  category: 'display',
  summary: 'A small square label in a Metro tone, filled or outlined, optionally removable.',
  platform: 'all',
  description:
    'Tags label things: a status, a category, a filter in use. With no `tone` a tag is neutral grey. A tone can be a Metro colour name (`teal`, `orange`), a status (`success`, `danger`), `accent`, or any CSS colour.\n\n`onRemove` adds a small × button, for filters and picked recipients.',
  examples: ['Tones', 'Outline', 'Removable'],
  props: [
    { name: 'tone', type: "'accent' | 'danger' | 'warning' | 'success' | 'info' | Tone", description: 'The colour. Default: neutral grey.' },
    { name: 'variant', type: "'filled' | 'outline'", default: "'filled'", description: 'A solid fill with white text, or a 1px outline in the tone.' },
    { name: 'icon', type: 'IconSource', description: 'An icon before the text.' },
    { name: 'onRemove', type: '() => void', description: 'Show a remove button that calls this.' },
    { name: 'removeLabel', type: 'string', default: "'remove'", description: 'Spoken name of the remove button.' },
    { name: 'children', type: 'ReactNode', description: 'The label.' },
  ],
  accessibility: ['The remove button is a native button; give `removeLabel` the tag name, e.g. `remove design`, when there are several.'],
} satisfies ComponentDoc
