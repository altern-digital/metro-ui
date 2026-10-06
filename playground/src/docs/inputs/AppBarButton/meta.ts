import type { ComponentDoc } from '../../types'

export default {
  name: 'AppBarButton',
  category: 'inputs',
  summary: 'The Windows 8 / Phone app bar button: an icon in a circle, a small caption below.',
  platform: 'all',
  description:
    'Put a row of them in an app bar or command bar. The circle is the one radius Metro allows in inputs. Hover and press act on the circle: pressed, it fills with the text colour and the glyph turns to the background.\n\n`compact` hides the caption (it stays as the spoken name and the tooltip). `pressed` makes it a toggle: the circle stays filled and `aria-pressed` follows.',
  examples: ['Basic', 'Toggle', 'Compact'],
  props: [
    { name: 'icon', type: 'IconSource', required: true, description: 'The glyph inside the circle.' },
    { name: 'label', type: 'string', required: true, description: 'The lowercase caption, and the spoken name.' },
    { name: 'compact', type: 'boolean', default: 'false', description: 'Hide the caption; it becomes the tooltip.' },
    { name: 'pressed', type: 'boolean', description: 'Make it a toggle. `true` fills the circle; leave undefined for a plain button.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Not pressable.' },
  ],
  accessibility: ['A native `<button>`, named by its caption (visually hidden when `compact`).', 'With `pressed` it carries `aria-pressed`.'],
} satisfies ComponentDoc
