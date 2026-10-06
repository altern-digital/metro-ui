import type { ComponentDoc } from '../../types'

export default {
  name: 'TileGrid',
  category: 'data',
  summary: 'The Start screen: groups of mixed-size tiles packed into a dense grid.',
  platform: 'adaptive',
  description:
    'The grid works in half cells, so four small tiles fill one medium cell and wide and large tiles leave no holes (`grid-auto-flow: dense`).\n\nWith `layout="auto"` groups sit side by side and scroll sideways on the desktop, as on the Windows 8 Start screen, and stack on a phone. On a narrow container the cells shrink so two medium tiles always fit across.\n\nTiles slide in one after another when the grid mounts; reduced motion or `animate={false}` skips it.',
  related: ['Tile', 'LiveTile'],
  examples: ['StartScreen', 'Phone', 'Children'],
  props: [
    { name: 'groups', type: '{ title?: ReactNode; tiles: ReactNode; key?: Key }[]', description: 'Named groups of tiles.' },
    { name: 'children', type: 'ReactNode', description: 'Tiles for a single untitled group, when there are no `groups`.' },
    { name: 'layout', type: "'auto' | 'horizontal' | 'vertical'", default: "'auto'", description: '`horizontal`: groups side by side; `vertical`: stacked; `auto`: vertical on mobile.' },
    { name: 'tileSize', type: 'number | string', default: '--mt-tile-size (150px)', description: 'Cell size. Shrinks to fit two cells across a narrow container.' },
    { name: 'gap', type: 'number | string', default: '--mt-tile-gap (8px)', description: 'Space between tiles.' },
    { name: 'groupColumns', type: 'number', default: '4', description: 'Medium tiles across one group in the horizontal layout.' },
    { name: 'animate', type: 'boolean', default: 'true', description: 'Slide the tiles in on mount.' },
  ],
  accessibility: [
    'A titled group is a `<section>` named by its title, with an `<h2>` heading.',
    'Tiles keep document order for Tab, whatever gaps the dense packing fills.',
  ],
} satisfies ComponentDoc
