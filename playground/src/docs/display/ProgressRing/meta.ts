import type { ComponentDoc } from '../../types'

export default {
  name: 'ProgressRing',
  category: 'display',
  summary: 'The Windows 8 spinning dots, or an arc that fills with progress.',
  platform: 'all',
  description:
    'With no `value`, five dots chase round a circle, speeding up and slowing down: the Metro busy indicator. With a `value` it draws a thin arc instead.\n\nUse `sm` (16px) inline in a button or a row, `md` (32px) in a panel and `lg` (64px) for a whole screen.',
  examples: ['Sizes', 'Determinate'],
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", description: '16, 32 or 64px, or any px size.' },
    { name: 'tone', type: "'accent' | 'danger' | 'warning' | 'success' | 'info' | Tone", default: "'accent'", description: 'The colour of the dots or the arc.' },
    { name: 'label', type: 'string', description: 'What is loading. Default: the locale `loading` text.' },
    { name: 'value', type: 'number', description: 'Progress, from 0 to `max`. Leave it out for the spinning dots.' },
    { name: 'max', type: 'number', default: '100', description: 'The value at which the arc is a full circle.' },
  ],
  accessibility: [
    'A `progressbar` named by `label`; `aria-valuenow` and its range are set only when determinate.',
    'Under reduced motion the dots stand still in a curve.',
    'Inside something that already announces loading, pass `aria-hidden`.',
  ],
} satisfies ComponentDoc
