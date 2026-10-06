import type { ComponentDoc } from '../../types'

export default {
  name: 'Stack',
  category: 'layout',
  summary: 'A flex row or column with gaps from the spacing scale.',
  platform: 'all',
  description:
    'Stack spaces its children evenly along one axis. `gap` is a step on the 4px spacing scale (`3` is 12px), so spacing stays on the grid.\n\nUse `direction="row"` with `justify="between"` for a bar with something at each end, and `wrap` for chips that flow onto new lines.',
  examples: ['Column', 'Row', 'Wrap'],
  props: [
    { name: 'direction', type: "'row' | 'column'", default: "'column'", description: 'The main axis.' },
    { name: 'gap', type: '0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8', default: '3', description: 'Space between children: 0, 4, 8, 12, 16, 20, 24, 32 or 40px.' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", description: 'Cross-axis alignment.' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", description: 'Main-axis distribution.' },
    { name: 'wrap', type: 'boolean', default: 'false', description: 'Let children wrap onto new lines.' },
    { name: 'as', type: 'ElementType', default: "'div'", description: 'The element to render.' },
    { name: 'children', type: 'ReactNode', description: 'The items.' },
  ],
} satisfies ComponentDoc
