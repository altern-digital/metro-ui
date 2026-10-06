import type { ComponentDoc } from '../../types'

export default {
  name: 'InfoBar',
  category: 'feedback',
  summary: 'An inline message with a severity colour that stays in the page.',
  platform: 'all',
  description:
    'Use it for state that lasts: offline, a failed sync, a licence about to expire. It sits in the page flow, with a coloured bar on the left, a glyph, the message, an optional action and an optional close button.\n\nFor a message that should go away on its own, use a toast.',
  related: ['useToast', 'Dialog'],
  examples: ['Basic', 'Severities', 'Action', 'Fill'],
  props: [
    { name: 'severity', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Sets the colour and glyph.' },
    { name: 'title', type: 'ReactNode', description: 'A bold lead-in.' },
    { name: 'message', type: 'ReactNode', description: 'The message. `children` works too and comes after it.' },
    { name: 'icon', type: 'IconSource | false', description: 'Replaces the glyph; `false` hides it.' },
    { name: 'action', type: 'ReactNode', description: 'Usually a small Button or a link, at the end.' },
    { name: 'closable', type: 'boolean', default: 'false', description: 'Shows a close button that calls `onClose`.' },
    { name: 'onClose', type: '() => void', description: 'Called by the close button. Hiding the bar is up to you.' },
    { name: 'appearance', type: "'bar' | 'fill'", default: "'bar'", description: '`bar`: a 4px colour bar on the left. `fill`: a tint across the whole bar.' },
    { name: 'closeLabel', type: 'string', default: "locale 'close'", description: 'Label of the close button.' },
  ],
  accessibility: [
    'Error and warning are `role="alert"` and are announced at once; info and success are `role="status"`.',
    'Render it only when the state starts, so screen readers announce the change.',
  ],
} satisfies ComponentDoc
