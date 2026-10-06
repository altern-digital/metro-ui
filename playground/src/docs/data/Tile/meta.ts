import type { ComponentDoc } from '../../types'

export default {
  name: 'Tile',
  category: 'data',
  summary: 'A flat square of colour with a name in its corner: the Start screen tile.',
  platform: 'all',
  description:
    'Four sizes from the tile tokens: `small` is a quarter cell, `medium` one cell, `wide` two across, `large` two by two. A cell is `--mt-tile-size` (150px).\n\nText is white on a tone unless the tone is light enough to need black. With `href` or `onClick` the tile is pressable: it shows a 3px outline on hover and leans a few degrees toward the pointer when pressed, unless motion is reduced.\n\nPut tiles in a `TileGrid` to pack them and slide them in.',
  related: ['TileGrid', 'LiveTile'],
  examples: ['Sizes', 'Content', 'Images'],
  props: [
    { name: 'size', type: "'small' | 'medium' | 'wide' | 'large'", default: "'medium'", description: 'How many cells it covers.' },
    { name: 'tone', type: 'Tone', default: 'accent', description: 'A Metro tone (`teal`), a theme tone or any CSS colour.' },
    { name: 'title', type: 'ReactNode', description: 'The name in the bottom-left corner. Hidden on small tiles.' },
    { name: 'icon', type: 'IconSource', description: 'Centred on small and medium tiles, top-left on wide and large ones.' },
    { name: 'badge', type: 'ReactNode', description: 'A Windows 8 badge in the bottom-right corner: a number or a small glyph.' },
    { name: 'count', type: 'ReactNode', description: 'A big light number beside the icon (unread mail, missed calls).' },
    { name: 'image', type: 'string', description: 'A background image that covers the tile.' },
    { name: 'imageOverlay', type: 'boolean | Tone', description: '`true` darkens the image so text reads; a tone tints it.' },
    { name: 'href', type: 'string', description: 'Render a link.' },
    { name: 'onClick', type: '(event) => void', description: 'Render a button.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Not pressable.' },
    { name: 'children', type: 'ReactNode', description: 'Custom content, under the title and badge.' },
  ],
  accessibility: [
    'A `<button>` with `onClick`, an `<a>` with `href`, otherwise a plain `<div>`.',
    'The title is its accessible name. A tile with only an icon needs an `aria-label`.',
    'Images are decorative (`alt=""`); say what matters in the title.',
  ],
} satisfies ComponentDoc
