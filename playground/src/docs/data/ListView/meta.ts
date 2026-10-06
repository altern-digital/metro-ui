import type { ComponentDoc } from '../../types'

export default {
  name: 'ListView',
  category: 'data',
  summary: 'A Windows Phone list: rows with a title and a muted second line, groups and selection.',
  platform: 'all',
  description:
    'Pass `items` and `renderItem`, or ListItems as children. Each row from `items` takes its key from `itemKey` (default the `key` or `id` field, else the index); a child ListItem takes it from `value`.\n\nWith `selectionMode="single"` or `"multiple"` the list becomes a listbox and the rows select. Selection is always an array of keys, controlled with `selected` or not with `defaultSelected`.\n\n`groupBy` puts items under letter headers, as in the People hub. Each header has `id="${id}-group-${key}"` and `data-group={key}`, so a jump list can scroll to it.',
  related: ['ListItem'],
  examples: ['Basic', 'Selection', 'Groups', 'Pressable'],
  props: [
    { name: 'items', type: 'T[]', description: 'The rows, drawn with `renderItem`.' },
    { name: 'renderItem', type: '(item: T, index: number) => ReactNode', description: 'Draws one row, usually a `<ListItem>`.' },
    { name: 'itemKey', type: '(item: T, index: number) => Key', default: 'item.key ?? item.id ?? index', description: "A row's key, for React and for selection." },
    { name: 'children', type: 'ReactNode', description: 'ListItems, when there are no `items`.' },
    { name: 'header', type: 'ReactNode', description: 'A lowercase heading above the list. It names the list.' },
    { name: 'dividers', type: 'boolean', default: 'false', description: 'Thin lines between rows.' },
    { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Whether rows select.' },
    { name: 'selected', type: 'Key[]', description: 'Selected keys (controlled).' },
    { name: 'defaultSelected', type: 'Key[]', default: '[]', description: 'Selected keys at first (uncontrolled).' },
    { name: 'onSelectionChange', type: '(keys: Key[]) => void', description: 'Called with the new keys.' },
    { name: 'groupBy', type: '(item: T) => string', description: 'Group `items` under headers, e.g. by first letter.' },
    { name: 'id', type: 'string', default: 'generated', description: 'Prefix for the group header ids.' },
  ],
  extraProps: {
    ListItem: [
      { name: 'title', type: 'ReactNode', description: 'The main line.' },
      { name: 'subtitle', type: 'ReactNode', description: 'A muted second line.' },
      { name: 'meta', type: 'ReactNode', description: 'Small and muted on the right: a time, a size.' },
      { name: 'leading', type: 'ReactNode', description: 'Anything at the start: an avatar, a checkbox. Overrides `icon`.' },
      { name: 'icon', type: 'IconSource', description: 'An icon in a square at the start.' },
      { name: 'tone', type: 'Tone', description: 'Fills the leading square, like a small tile.' },
      { name: 'trailing', type: 'ReactNode', description: 'Anything at the end, after `meta`.' },
      { name: 'selected', type: 'boolean', default: 'false', description: 'Shown as selected. Inside a selecting ListView, the list decides.' },
      { name: 'value', type: 'Key', description: 'Its key in the selection, for a child ListItem.' },
      { name: 'onClick', type: '(event) => void', description: 'Makes the row a button.' },
      { name: 'href', type: 'string', description: 'Makes the row a link.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Not pressable or selectable.' },
    ],
  },
  accessibility: [
    'Without selection it is a `list` of `listitem`s; pressable rows hold a button or link.',
    'With selection it is a `listbox` of `option`s with `aria-selected`, and `aria-multiselectable` in multiple mode.',
    'The list is one Tab stop. Up and Down move between rows, Home and End jump to the ends, Space and Enter select.',
    'Each group is a `list` (or `group` in a listbox) named by its header.',
  ],
} satisfies ComponentDoc
