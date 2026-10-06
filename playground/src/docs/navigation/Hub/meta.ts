import type { ComponentDoc } from '../../types'

export default {
  name: 'Hub',
  category: 'navigation',
  summary: 'A wide horizontal panorama of sections under one huge title, with parallax.',
  platform: 'adaptive',
  description:
    'The Windows Phone panorama and the Windows 8 hub: a title larger than the screen and a row of sections that scroll sideways. The background and the title move slower than the sections, so the page feels deep.\n\nOn the desktop the sections keep their own widths and the mouse wheel scrolls sideways. On a phone each section fills the screen and snaps into place.\n\nGive the Hub a height; it scrolls horizontally inside it.',
  examples: ['Basic', 'Background'],
  props: [
    { name: 'sections', type: 'HubSection[]', required: true, description: '`{ key, title?, content, width? }` for each section. `width` (px or any CSS length) applies on the desktop.' },
    { name: 'title', type: 'ReactNode', description: 'The big title across the top.' },
    { name: 'background', type: 'string', description: 'An image URL for the parallax background.' },
    { name: 'parallax', type: 'number', default: '0.25', description: 'How much slower the background moves than the sections. The title moves at twice this. 0 turns it off.' },
    { name: 'platform', type: "'mobile' | 'desktop' | 'auto'", default: "'auto'", description: 'Force a form. Default: the provider platform.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5', default: '1', description: 'Heading level of the title; section titles are one below.' },
  ],
  accessibility: [
    'The title is a heading and each titled section is a `region` named by its own heading.',
    'Parallax is skipped when the user prefers reduced motion.',
    'The vertical wheel only scrolls sideways when nothing inside can scroll vertically.',
  ],
} satisfies ComponentDoc
