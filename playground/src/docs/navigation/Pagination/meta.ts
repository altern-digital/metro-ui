import type { ComponentDoc } from '../../types'

export default {
  name: 'Pagination',
  category: 'navigation',
  summary: 'Square page buttons with the current page filled in the accent.',
  platform: 'adaptive',
  description:
    'Numbered pages between previous and next arrows. Long ranges keep the first and last pages and the ones around the current page, with "…" for the gaps.\n\nOn a phone it turns simple by default: just the arrows and "3 / 12". Give either `total` pages, or `count` items and a `pageSize`.\n\n`paginationRange(page, total, siblings, boundaries)` is exported too, for building your own.',
  related: ['paginationRange'],
  examples: ['Basic', 'Items', 'Simple'],
  props: [
    { name: 'page', type: 'number', description: 'The current page, from 1 (controlled).' },
    { name: 'defaultPage', type: 'number', default: '1', description: 'The page at first (uncontrolled).' },
    { name: 'onChange', type: '(page: number) => void', description: 'Called with the picked page.' },
    { name: 'total', type: 'number', description: 'How many pages. Or give `count` and `pageSize`.' },
    { name: 'count', type: 'number', description: 'How many items, to work out the pages from.' },
    { name: 'pageSize', type: 'number', default: '10', description: 'Items per page, with `count`.' },
    { name: 'siblings', type: 'number', default: '1', description: 'Pages shown each side of the current one.' },
    { name: 'boundaries', type: 'number', default: '1', description: 'Pages always shown at each end.' },
    { name: 'simple', type: 'boolean', default: 'true on mobile', description: 'Arrows and "page / total" only.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Not pressable.' },
    { name: 'aria-label', type: 'string', default: "'pagination'", description: 'Names the navigation landmark.' },
  ],
  accessibility: [
    'A `nav` landmark. Each page button is named "page n" (from the locale) and the current one has `aria-current="page"`.',
    'The arrows are named by the locale `previous` and `next`, and are disabled at the ends.',
    'In the simple form the "3 / 12" text is a polite live region.',
  ],
} satisfies ComponentDoc
