import type { ComponentDoc } from '../../types'

export default {
  name: 'PageStates',
  category: 'display',
  summary: 'Loading, empty, error or the content: one switch for a data-driven screen.',
  platform: 'all',
  description:
    'PageStates saves writing the same four branches on every screen that fetches. Pass the `state` and it shows a spinner, an EmptyState, a red error band with a retry button, or the children.\n\nThe built-in text comes from the locale (`loading`, `empty`, `error`, `retry`); `loading`, `empty` and `error` replace it. Pass an `Error` as `error` and its message is shown.',
  examples: ['States', 'Custom'],
  props: [
    { name: 'state', type: "'loading' | 'empty' | 'error' | 'ready'", required: true, description: 'Which to show.' },
    { name: 'children', type: 'ReactNode', description: 'The content, shown when `ready`.' },
    { name: 'loading', type: 'ReactNode', description: 'Text beside the spinner. Default: the locale `loading` text.' },
    { name: 'empty', type: 'ReactNode', description: 'A title for the default EmptyState, or your own element.' },
    { name: 'error', type: 'ReactNode | Error', description: 'What went wrong, under the locale `error` heading.' },
    { name: 'onRetry', type: '() => void', description: 'Show a retry button in the error band.' },
  ],
  accessibility: [
    'Loading is a `status` and the error band an `alert`, so both are announced when they appear.',
  ],
} satisfies ComponentDoc
