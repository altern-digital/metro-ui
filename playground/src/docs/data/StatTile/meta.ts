import type { ComponentDoc } from '../../types'

export default {
  name: 'StatTile',
  category: 'data',
  summary: 'A big light number with a small label and how it moved.',
  platform: 'all',
  description:
    'For dashboards: a lowercase label, the value in light weight and tabular figures, and a delta that is green with an up arrow when it rises and red with a down arrow when it falls. Set `invertDelta` where falling is good (costs, errors).\n\nWithout a `tone` it sits on a panel; with one it fills like a tile. `animate` counts a numeric value up from zero, then from each value to the next.',
  related: ['BarChart'],
  examples: ['Basic', 'Tones', 'Animated'],
  props: [
    { name: 'label', type: 'ReactNode', required: true, description: 'What is counted.' },
    { name: 'value', type: 'ReactNode', required: true, description: 'The number, or any content.' },
    { name: 'delta', type: 'number | ReactNode', description: 'The change. A number gets a sign, an arrow and a colour; a node shows as given.' },
    { name: 'formatDelta', type: '(delta: number) => ReactNode', default: 'format', description: 'Formats a numeric delta, without its sign.' },
    { name: 'invertDelta', type: 'boolean', default: 'false', description: 'Down is good: falling is green.' },
    { name: 'caption', type: 'ReactNode', description: 'A muted line beside the delta (“vs last month”).' },
    { name: 'icon', type: 'IconSource', description: 'A small icon beside the label.' },
    { name: 'tone', type: 'Tone', description: 'Fill the tile with a tone.' },
    { name: 'animate', type: 'boolean', default: 'false', description: 'Count to a numeric value.' },
    { name: 'format', type: '(value: number) => ReactNode', default: 'toLocaleString', description: 'Formats a numeric value.' },
  ],
  accessibility: [
    'Plain text in reading order: label, value, delta. The arrow is decorative; the sign carries the direction.',
    'While counting, the text changes every frame; pass `animate` only where that is acceptable, and never for a value a screen reader is watching live.',
  ],
} satisfies ComponentDoc
