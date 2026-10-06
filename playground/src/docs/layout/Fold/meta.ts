import type { ComponentDoc } from '../../types'

export default {
  name: 'Fold',
  category: 'layout',
  summary: 'A heading that folds its content open and shut; Expander is the boxed version.',
  platform: 'all',
  description:
    '`Fold` is bare: a lowercase heading with a chevron, for long settings pages and FAQs. `Expander` puts the same thing in a bordered panel, like the Windows settings expander. Both take the same props.\n\nThe content folds open with the Metro enter curve. With reduced motion it simply appears.',
  related: ['Expander'],
  examples: ['Basic', 'Expanders', 'Controlled'],
  props: [
    { name: 'title', type: 'ReactNode', required: true, description: 'The heading that opens and closes it.' },
    { name: 'description', type: 'ReactNode', description: 'A muted line under the title.' },
    { name: 'icon', type: 'IconSource', description: 'An icon before the title.' },
    { name: 'open', type: 'boolean', description: 'Open, when controlled.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Open at first, when uncontrolled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the heading is pressed.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Cannot be opened or closed.' },
    { name: 'keepCase', type: 'boolean', default: 'false', description: 'Keep the title as written.' },
    { name: 'children', type: 'ReactNode', description: 'The content.' },
  ],
  accessibility: [
    'The heading is a native button with `aria-expanded` and `aria-controls`.',
    'The content is a region labelled by the heading.',
    'Enter and Space toggle it.',
  ],
} satisfies ComponentDoc
