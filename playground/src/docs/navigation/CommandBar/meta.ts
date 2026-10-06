import type { ComponentDoc } from '../../types'

export default {
  name: 'CommandBar',
  category: 'navigation',
  summary: 'A bar of commands: square buttons on the desktop, the round Windows Phone app bar on a phone.',
  platform: 'adaptive',
  description:
    'On the desktop it is the Windows 10 CommandBar: icon buttons with labels on the right, below, or hidden, and the `secondary` commands behind "…" in a MenuFlyout. `content` sits on the left, for a title or a search box.\n\nOn a phone it is the Windows Phone app bar along the bottom edge: round icons without labels. "…" lifts the bar to show the labels and the secondary commands as a list. A tap outside, Escape, or running a command lowers it again.\n\nThe phone bar is fixed to the viewport by default. Inside a bounded box, such as these examples, set `position="absolute"` and give the box `position: relative` and a height.',
  examples: ['Desktop', 'Labels', 'Mobile'],
  props: [
    { name: 'primary', type: 'CommandItem[]', default: '[]', description: '`{ key, label, icon?, onClick?, disabled?, toggled? }` shown as buttons. `toggled` makes a pressed toggle.' },
    { name: 'secondary', type: 'CommandItem[]', default: '[]', description: 'Commands behind "…".' },
    { name: 'content', type: 'ReactNode', description: 'On the desktop: anything on the left of the bar.' },
    { name: 'labels', type: "'right' | 'bottom' | 'collapsed'", default: "'right'", description: 'On the desktop: where the labels sit, or hidden (then they name and title the buttons).' },
    { name: 'platform', type: "'mobile' | 'desktop' | 'auto'", default: "'auto'", description: 'Force a form. Default: the provider platform.' },
    { name: 'position', type: "'fixed' | 'absolute' | 'static'", default: "'fixed'", description: 'On a phone: fixed to the viewport bottom, absolute to the positioned box bottom, or in the flow.' },
    { name: 'open', type: 'boolean', description: 'On a phone: whether the bar is lifted (controlled).' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'On a phone: lifted at first (uncontrolled).' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the bar lifts or lowers.' },
  ],
  accessibility: [
    'The bar is a `toolbar`. Toggle commands set `aria-pressed`.',
    'When labels are hidden the label becomes the button\'s `aria-label`.',
    'The "…" button is named by the locale `more`. On the desktop it opens a keyboard-driven menu; on a phone it reports `aria-expanded`.',
  ],
} satisfies ComponentDoc
