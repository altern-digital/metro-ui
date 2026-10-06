import type { ComponentDoc } from '../../types'

export default {
  name: 'JumpList',
  category: 'mobile',
  summary: 'The Windows Phone letter grid for jumping through a long grouped list.',
  platform: 'mobile',
  description:
    'Press a group header in a long alphabetical list (`JumpListHeader`, a small accent-outlined square) and a full-screen grid of letter tiles opens over a scrim. Letters the list has are lit in the accent; the rest are dim and cannot be picked. Picking a letter scrolls its group into view and closes the grid.\n\nGive each group\'s element the id `${listId}-group-${letter}` and pass `listId`, or handle `onJump` yourself.',
  related: ['JumpListHeader', 'JUMP_ALPHABET'],
  examples: ['Contacts', 'Alphabet'],
  props: [
    { name: 'groups', type: 'string[]', required: true, description: 'The group letters the list has.' },
    { name: 'open', type: 'boolean', description: 'Whether the grid shows (controlled).' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Shows at first (uncontrolled).' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it opens or closes.' },
    { name: 'alphabet', type: 'string[]', default: "'#' and a to z", description: 'The tiles, in order.' },
    { name: 'listId', type: 'string', description: 'Picking `b` scrolls the element with id `${listId}-group-b` into view.' },
    { name: 'onJump', type: '(letter: string) => void', description: 'Called with the picked letter.' },
    { name: 'label', type: 'string', default: "'jump to'", description: 'The grid\'s accessible name.' },
  ],
  extraProps: {
    JumpListHeader: [
      { name: 'letter', type: 'string', required: true, description: 'The group\'s letter.' },
      { name: '...button props', type: 'ButtonHTMLAttributes', description: 'Usually `onClick` to open the JumpList.' },
    ],
  },
  accessibility: [
    'The grid is a modal `dialog` that traps focus and closes on Escape or a tap on the scrim.',
    'Letters the list lacks are disabled buttons.',
    'The header is a button named by its letter; add an `aria-label` such as "b, jump to a letter" if you like.',
  ],
} satisfies ComponentDoc
