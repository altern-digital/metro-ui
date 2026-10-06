import type { ComponentDoc } from '../../types'

export default {
  name: 'NavigationView',
  category: 'navigation',
  summary: 'The app frame: a left pane on the desktop, an icon strip on a tablet, a tab bar on a phone.',
  platform: 'adaptive',
  description:
    "Windows 10's NavigationView wraps the page. In `auto` mode it picks its form from the provider: a full `expanded` pane from 1008px wide, a `compact` icon strip from 641px, and a `bottom` tab bar on a phone. The menu button collapses the expanded pane to icons, or lays the full pane over the content in the compact and `minimal` forms.\n\nOn the bottom bar the first `bottomItems` items get tabs and the rest (groups, footer items) go under \"more\", in a sheet.\n\nItems with `items` are groups, one level deep, folding open in the pane. Items with `href` render as links through `linkComponent`.\n\nBy default the bottom bar and its sheet are fixed to the viewport. Inside a bounded box, such as these examples, set `position=\"absolute\"` and give the box `position: relative` and a height.",
  examples: ['Expanded', 'Compact', 'Bottom', 'Links'],
  props: [
    { name: 'items', type: 'NavItem[]', required: true, description: '`{ key, label, icon?, href?, badge?, items?, disabled? }` for each row. `items` makes a group.' },
    { name: 'footerItems', type: 'NavItem[]', default: '[]', description: 'Rows pinned to the bottom of the pane, such as settings.' },
    { name: 'value', type: 'string | null', description: 'The selected key (controlled).' },
    { name: 'defaultValue', type: 'string | null', default: 'null', description: 'The selected key at first (uncontrolled).' },
    { name: 'onChange', type: '(key: string) => void', description: 'Called with the picked key.' },
    { name: 'header', type: 'ReactNode', description: 'The title next to the menu button.' },
    { name: 'children', type: 'ReactNode', description: 'The page.' },
    { name: 'mode', type: "'auto' | 'expanded' | 'compact' | 'minimal' | 'bottom'", default: "'auto'", description: 'Force a form. `auto` follows the platform and breakpoint.' },
    { name: 'linkComponent', type: 'ElementType', default: "'a'", description: 'Renders rows with `href`, e.g. Next.js `Link`.' },
    { name: 'storageKey', type: 'string', description: 'Remember whether the expanded pane was collapsed, in localStorage under this key.' },
    { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: 'Start with the expanded pane collapsed to icons.' },
    { name: 'bottomItems', type: 'number', default: '4', description: 'How many tabs the bottom bar shows before "more".' },
    { name: 'position', type: "'fixed' | 'absolute'", default: "'fixed'", description: 'Where the bottom bar and its sheet sit: on the viewport, or on the nearest positioned box.' },
    { name: 'aria-label', type: 'string', default: "locale 'menu'", description: 'Names the navigation landmark.' },
  ],
  accessibility: [
    'The pane is a `nav` landmark; the selected row has `aria-current="page"`.',
    'Up and Down move between rows, Home and End to the first and last.',
    'Group rows are buttons with `aria-expanded`; their children are in a `group`.',
    'In the icon strip the labels stay in the accessible name, visually hidden.',
    'The overlay pane and the "more" sheet close on Escape. The sheet is a modal dialog that traps focus.',
  ],
} satisfies ComponentDoc
