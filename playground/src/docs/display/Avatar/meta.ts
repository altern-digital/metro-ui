import type { ComponentDoc } from '../../types'

export default {
  name: 'Avatar',
  category: 'display',
  summary: 'A picture or initials on a tone picked from the name, with a presence dot.',
  platform: 'all',
  description:
    'Avatars are square by default, like the Windows Phone people hub; `shape="circle"` is there for apps that want it. With no picture, or one that fails to load, the initials show on a Metro tone picked from the name, so the same person always gets the same colour.\n\n`toneForName` and `initialsOf` are exported for building the same look elsewhere.',
  related: ['toneForName', 'initialsOf'],
  examples: ['Initials', 'Pictures', 'Sizes'],
  props: [
    { name: 'name', type: 'string', description: 'The person: initials, tone and spoken name.' },
    { name: 'src', type: 'string', description: 'A picture. Falls back to the initials if it fails.' },
    { name: 'alt', type: 'string', description: 'Spoken name, when it differs from `name`.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: '32, 40, 64 or 96px, or any px size.' },
    { name: 'shape', type: "'square' | 'circle'", default: "'square'", description: 'The outline.' },
    { name: 'tone', type: "'accent' | 'danger' | 'warning' | 'success' | 'info' | Tone", description: 'Background behind the initials. Default: picked from the name.' },
    { name: 'status', type: "'online' | 'away' | 'busy' | 'offline'", description: 'A presence dot in the corner.' },
  ],
  accessibility: [
    '`role="img"` named after the person, with the status in brackets: “Ada Lovelace (online)”.',
    'With no name it is hidden from screen readers, as decoration.',
  ],
} satisfies ComponentDoc
