import type { ComponentDoc } from '../../types'

export default {
  name: 'Divider',
  category: 'layout',
  summary: 'A 1px rule, across or down, with an optional label.',
  platform: 'all',
  examples: ['Basic', 'Vertical'],
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Across a column, or down a row.' },
    { name: 'label', type: 'ReactNode', description: 'Text in the middle of a horizontal rule.' },
    { name: 'keepCase', type: 'boolean', default: 'false', description: 'Keep the label as written.' },
  ],
  accessibility: ['`role="separator"` with `aria-orientation`.'],
} satisfies ComponentDoc
