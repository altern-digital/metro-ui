import type { ComponentDoc } from '../../types'

export default {
  name: 'Section',
  category: 'layout',
  summary: 'A titled group of content inside a page, with a description and actions.',
  platform: 'all',
  description:
    'Section breaks a page into parts, each with a light lowercase heading. It renders a `<section>` labelled by its title, so screen readers list it as a region.\n\nThe heading is an `h2`; nest sections and set `titleAs="h3"` to keep the outline in order.',
  examples: ['Basic', 'WithActions'],
  props: [
    { name: 'title', type: 'ReactNode', description: 'The heading.' },
    { name: 'description', type: 'ReactNode', description: 'A muted line under the heading.' },
    { name: 'actions', type: 'ReactNode', description: 'Controls on the right of the heading.' },
    { name: 'titleAs', type: 'ElementType', default: "'h2'", description: 'The heading element.' },
    { name: 'keepCase', type: 'boolean', default: 'false', description: 'Keep the title as written.' },
    { name: 'children', type: 'ReactNode', description: 'The content.' },
  ],
  accessibility: ['A `<section>` with `aria-labelledby` pointing at its heading.'],
} satisfies ComponentDoc
