import type { ComponentDoc } from '../../types'

export default {
  name: 'Breadcrumb',
  category: 'navigation',
  summary: 'The path to the current page, with a chevron between levels.',
  platform: 'desktop',
  description:
    'A Windows 10 breadcrumb bar: muted links to each parent, the current page in the text colour. With `maxItems` a long path keeps its first item and its last few, folding the middle into "…"; pressing it shows the whole path.\n\nOn a phone, prefer a back button: there is rarely room for a path.',
  examples: ['Basic', 'Folded'],
  props: [
    { name: 'items', type: 'BreadcrumbItem[]', required: true, description: '`{ key, label, href?, onClick? }` from the root to the current page. The last item is the current page.' },
    { name: 'maxItems', type: 'number', description: 'Fold the middle once there are more items than this.' },
    { name: 'linkComponent', type: 'ElementType', default: "'a'", description: 'Renders the links, e.g. Next.js `Link`. Receives `href`, `className` and `children`.' },
    { name: 'aria-label', type: 'string', default: "'breadcrumb'", description: 'Names the navigation landmark.' },
  ],
  accessibility: [
    'A `nav` landmark holding an ordered list.',
    'The last item is marked `aria-current="page"`.',
    'The "…" button is named by the locale `more` and unfolds the full path.',
    'The chevrons are decorative and hidden from screen readers.',
  ],
} satisfies ComponentDoc
