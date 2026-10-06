import type { ComponentDoc } from '../../types'

export default {
  name: 'useToast',
  category: 'feedback',
  summary: 'Short messages that come and go on their own.',
  platform: 'adaptive',
  description:
    'Call `useToast()` anywhere under a ConfigProvider and show a toast from any handler. There is no component to place: the provider renders them.\n\nOn the desktop they stack at the bottom right and slide in from the edge. On mobile they are full-width banners, and a sideways swipe dismisses one. They leave after `duration`, paused while hovered or focused. Reuse an `id` to update a toast in place.',
  related: ['InfoBar', 'useDialog'],
  examples: ['Basic', 'Tones', 'Action', 'Update'],
  props: [
    { name: 'show', type: '(options: ToastOptions | string) => string', description: 'Shows a toast and returns its id. A string is the title.' },
    { name: 'success / error / info / warning', type: '(options: ToastOptions | string) => string', description: 'The same, with that tone.' },
    { name: 'dismiss', type: '(id: string) => void', description: 'Removes one toast.' },
    { name: 'dismissAll', type: '() => void', description: 'Removes them all.' },
  ],
  extraProps: {
    ToastOptions: [
      { name: 'id', type: 'string', description: 'Reuse it to replace a toast in place; its time starts again.' },
      { name: 'title', type: 'ReactNode', description: 'The main line.' },
      { name: 'description', type: 'ReactNode', description: 'A second line.' },
      { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'error'", default: "'neutral'", description: 'Adds a coloured bar and glyph.' },
      { name: 'icon', type: 'IconSource | false', description: "Replaces the tone's glyph; `false` hides it." },
      { name: 'action', type: '{ label: ReactNode; onClick: () => void }', description: 'One button; pressing it also dismisses the toast.' },
      { name: 'duration', type: 'number', default: '5000', description: 'ms before it leaves; 0 keeps it until dismissed.' },
    ],
  },
  accessibility: [
    'Toasts live in one `role="region"` labelled "notifications" with `aria-live="polite"`.',
    'The timer pauses while a toast is hovered or has focus, so its action can be reached.',
    'Do not put the only way to do something in a toast; it goes away.',
  ],
} satisfies ComponentDoc
