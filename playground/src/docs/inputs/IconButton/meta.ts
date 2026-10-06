import type { ComponentDoc } from '../../types'

export default {
  name: 'IconButton',
  category: 'inputs',
  summary: 'A square button with only an icon, named by a required label.',
  platform: 'all',
  description:
    'Its side is the control height, so it lines up with fields and buttons at every density (32px with a mouse, 44px under a finger). It defaults to the `text` variant: no outline until hovered, for toolbars and rows.\n\nThe `label` is required: it becomes the `aria-label` and the tooltip (`title`).',
  examples: ['Basic', 'Variants', 'Sizes'],
  props: [
    { name: 'icon', type: 'IconSource', required: true, description: 'The glyph: a component (`VscAdd`) or an element.' },
    { name: 'label', type: 'string', required: true, description: 'What it does: the spoken name and the tooltip.' },
    { name: 'variant', type: "'default' | 'text' | 'accent'", default: "'text'", description: 'Outline, none, or accent fill.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Relative to the control height.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Show the Metro dots and ignore presses.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Not pressable.' },
  ],
  accessibility: ['A native `<button type="button">` with `aria-label` and `title` from `label`.'],
} satisfies ComponentDoc
