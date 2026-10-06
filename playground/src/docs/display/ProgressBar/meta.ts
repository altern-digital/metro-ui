import type { ComponentDoc } from '../../types'

export default {
  name: 'ProgressBar',
  category: 'display',
  summary: 'A 4px bar that fills with progress, or the Metro running dots when the end is unknown.',
  platform: 'all',
  description:
    'Give it a `value` and it fills to `value / max`. Leave `value` out and five dots run across the track, the Windows 8 indeterminate bar.\n\nUnder reduced motion the dots stop in a still cluster in the middle, so it still reads as working.',
  examples: ['Determinate', 'Indeterminate'],
  props: [
    { name: 'value', type: 'number', description: 'Progress, from 0 to `max`. Leave it out for indeterminate.' },
    { name: 'max', type: 'number', default: '100', description: 'The value at which the bar is full.' },
    { name: 'tone', type: "'accent' | 'danger' | 'warning' | 'success' | 'info' | Tone", default: "'accent'", description: 'The fill.' },
    { name: 'label', type: 'ReactNode', description: 'A visible label above the bar, which also names it.' },
  ],
  accessibility: [
    'The track is a `progressbar` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax` when determinate.',
    'Named by `label`, or by the locale `loading` text when there is none.',
  ],
} satisfies ComponentDoc
