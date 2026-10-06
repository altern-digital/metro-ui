import type { ComponentDoc } from '../../types'

export default {
  name: 'Table',
  category: 'data',
  summary: 'A flat data table with sortable columns and totals, which turns into cards on a phone.',
  platform: 'adaptive',
  description:
    'Rows are parted by thin lines, not stripes. Numbers set `align: "right"` and line up in tabular figures. A column with `footer` adds a totals row under a heavy rule.\n\nSortable columns cycle ascending and descending. The table sorts its own rows unless `manualSort` is set, for sorting on a server. With `maxHeight` it scrolls inside that height with the header stuck on top.\n\nOn a phone each row becomes a card of `title  value` lines; `mobileLayout="scroll"` keeps the table and scrolls it sideways instead.',
  examples: ['Basic', 'Sorting', 'States', 'Scroll'],
  props: [
    { name: 'columns', type: 'TableColumn<T>[]', required: true, description: '`{ key, title, width?, align?, sortable?, render?, sortValue?, footer? }`.' },
    { name: 'data', type: 'T[]', required: true, description: 'The rows.' },
    { name: 'rowKey', type: 'keyof T | (row: T, index: number) => Key', default: "'id', else the index", description: "A row's key." },
    { name: 'sort', type: "{ key: string; direction: 'asc' | 'desc' } | null", description: 'Current sort (controlled).' },
    { name: 'defaultSort', type: 'TableSort | null', default: 'null', description: 'Sort at first (uncontrolled).' },
    { name: 'onSortChange', type: '(sort: TableSort | null) => void', description: 'Called when a header is pressed.' },
    { name: 'manualSort', type: 'boolean', default: 'false', description: 'Keep rows in the order given; only report sort changes.' },
    { name: 'onRowClick', type: '(row: T, index: number) => void', description: 'Makes rows pressable and focusable.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Dims the rows and runs a thin bar under the header.' },
    { name: 'empty', type: 'ReactNode', default: "locale 'empty'", description: 'Shown when there are no rows.' },
    { name: 'striped', type: 'boolean', default: 'false', description: 'Alternate row shading.' },
    { name: 'maxHeight', type: 'number | string', description: 'Scroll inside this height, header stuck on top.' },
    { name: 'mobileLayout', type: "'cards' | 'scroll'", default: "'cards'", description: 'How it shows on a phone.' },
    { name: 'caption', type: 'ReactNode', description: "The table's name, shown above it." },
  ],
  extraProps: {
    TableColumn: [
      { name: 'key', type: 'string', required: true, description: 'The field it shows and sorts by.' },
      { name: 'title', type: 'ReactNode', required: true, description: 'The header.' },
      { name: 'width', type: 'number | string', description: 'Column width.' },
      { name: 'align', type: "'left' | 'center' | 'right'", default: "'left'", description: 'Right for numbers.' },
      { name: 'sortable', type: 'boolean', default: 'false', description: 'The header sorts.' },
      { name: 'render', type: '(row: T, index: number) => ReactNode', description: 'The cell content.' },
      { name: 'sortValue', type: '(row: T) => string | number | null | undefined', description: 'What to sort by, if not the field.' },
      { name: 'footer', type: 'ReactNode', description: "This column's cell in the totals row." },
    ],
  },
  accessibility: [
    'A native `<table>` with `scope="col"` headers. Sortable headers hold a button and carry `aria-sort`.',
    'Pressable rows are focusable and respond to Enter and Space.',
    'While loading the table sets `aria-busy`.',
    'Mobile cards are a list of `<dl>` term/value pairs.',
  ],
} satisfies ComponentDoc
