import type { ComponentDoc } from '../../types'

export default {
  name: 'Grid',
  category: 'layout',
  summary: 'A CSS grid with fixed, responsive or auto-filling columns.',
  platform: 'adaptive',
  description:
    'Pass a number for fixed columns, or `{ compact, medium, expanded }` for counts per breakpoint (640px and 1007px). Missing steps take the one below, and compact defaults to 1.\n\n`minChildWidth` fills the row with as many columns as fit at that width instead, and wins over `columns`.',
  examples: ['Fixed', 'Responsive', 'AutoFill'],
  props: [
    { name: 'columns', type: 'number | { compact?: number; medium?: number; expanded?: number }', default: '1', description: 'Column count, fixed or per breakpoint.' },
    { name: 'minChildWidth', type: 'number | string', description: 'Auto-fill columns at least this wide (px, or any CSS length).' },
    { name: 'gap', type: '0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8', default: '3', description: 'Space between cells, a step on the spacing scale.' },
    { name: 'as', type: 'ElementType', default: "'div'", description: 'The element to render.' },
    { name: 'children', type: 'ReactNode', description: 'The cells.' },
  ],
} satisfies ComponentDoc
