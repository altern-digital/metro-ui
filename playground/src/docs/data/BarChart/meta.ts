import type { ComponentDoc } from '../../types'

export default {
  name: 'BarChart',
  category: 'data',
  summary: 'Flat bars in plain HTML and CSS, growing in from their baseline.',
  platform: 'all',
  description:
    'No SVG and no chart library: each bar is a block scaled to its share of `max` (default the largest value). Vertical bars stand on a heavy baseline with labels under it; horizontal bars run from a rule with labels on the left.\n\nBars grow in one after another with a CSS transform on the enter curve. Give each bar a `tone`, or the whole chart one.',
  related: ['StatTile'],
  examples: ['Vertical', 'Horizontal', 'Tones'],
  props: [
    { name: 'data', type: '{ label: string; value: number; tone?: Tone }[]', required: true, description: 'The bars.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Columns on a baseline, or rows.' },
    { name: 'max', type: 'number', default: 'largest value', description: 'The value a full bar stands for.' },
    { name: 'format', type: '(value: number) => string', default: 'toLocaleString', description: 'Formats values, on the bars and for screen readers.' },
    { name: 'showValues', type: 'boolean', default: 'true', description: 'Print each value on its bar.' },
    { name: 'tone', type: 'Tone', default: 'accent', description: 'Colour for bars without their own.' },
    { name: 'height', type: 'number | string', default: '200', description: 'Height of a vertical chart.' },
    { name: 'label', type: 'string', description: 'What the chart shows, read before the values.' },
  ],
  accessibility: [
    'The chart is one `role="img"` whose name lists every bar: “sales: jan 12, feb 18, …”.',
    'Give it a `label`; the summary starts with it.',
    'Under reduced motion the bars appear at full size without growing in.',
  ],
} satisfies ComponentDoc
