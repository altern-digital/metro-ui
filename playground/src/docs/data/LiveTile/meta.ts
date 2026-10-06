import type { ComponentDoc } from '../../types'

export default {
  name: 'LiveTile',
  category: 'data',
  summary: 'A tile whose content turns over by itself: headlines, photos, the next meeting.',
  platform: 'all',
  description:
    'Takes every Tile prop plus `faces`, which it cycles through every `interval` milliseconds (plus a small random offset, so a grid of live tiles never turns in lockstep).\n\nIt stops while the page is hidden, while it is scrolled out of view and under reduced motion, which shows only the first face. `counter` tweens a number beside the icon each time it changes.',
  related: ['Tile', 'TileGrid'],
  examples: ['Effects', 'Peek', 'Counter'],
  props: [
    { name: 'faces', type: '(ReactNode | { content?: ReactNode; image?: string })[]', required: true, description: 'What the tile cycles through. A face with `image` covers the tile with it.' },
    { name: 'effect', type: "'slide' | 'flip' | 'peek'", default: "'slide'", description: '`slide` pushes the next face up, `flip` turns the tile over, `peek` slides an image up to show the content under it.' },
    { name: 'interval', type: 'number', default: '5000', description: 'Milliseconds per face, before the random offset.' },
    { name: 'counter', type: 'number', description: 'A number beside the icon that counts to each new value.' },
    { name: 'paused', type: 'boolean', default: 'false', description: 'Stop cycling.' },
    { name: '…TileProps', type: 'TileProps', description: 'Everything a Tile takes except `children` and `count`.' },
  ],
  accessibility: [
    'Only the current face is in the DOM, so a screen reader reads the tile as it is now. The faces change without announcement.',
    'Under reduced motion the tile shows its first face and never turns.',
  ],
} satisfies ComponentDoc
