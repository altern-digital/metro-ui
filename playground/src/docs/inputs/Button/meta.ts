import type { ComponentDoc } from '../../types'

export default {
  name: 'Button',
  category: 'inputs',
  summary: 'Flat, square, lowercase buttons in five variants.',
  platform: 'all',
  description:
    'Use `accent` for the one thing to do on a screen, `primary` for the main action in a group, `default` for the rest and `text` inside bars and rows. `danger` is for what cannot be undone.\n\nWith `href` it renders an `<a>` that looks the same. Its height follows the provider density: 32px with a mouse, 44px under a finger.',
  examples: ['Variants', 'Sizes', 'Icons', 'States'],
  props: [
    { name: 'variant', type: "'default' | 'primary' | 'accent' | 'text' | 'danger'", default: "'default'", description: 'How much the button stands out.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and type size, relative to the density.' },
    { name: 'icon', type: 'IconSource', description: 'Leading icon: a component (`VscSave`) or an element.' },
    { name: 'iconEnd', type: 'IconSource', description: 'Trailing icon.' },
    { name: 'block', type: 'boolean', default: 'false', description: 'Fill the width of its container.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Show the Metro dots and ignore presses.' },
    { name: 'keepCase', type: 'boolean', default: 'false', description: 'Keep the label as written instead of lowercasing it.' },
    { name: 'href', type: 'string', description: 'Render a link instead of a button.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Not pressable.' },
  ],
  accessibility: [
    'A native `<button type="button">`, or an `<a>` with `href`.',
    'An icon-only button needs an `aria-label`.',
    'While loading it sets `aria-busy`.',
  ],
} satisfies ComponentDoc
