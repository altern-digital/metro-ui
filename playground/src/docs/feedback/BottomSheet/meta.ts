import type { ComponentDoc } from '../../types'

export default {
  name: 'BottomSheet',
  category: 'feedback',
  summary: 'A panel that rises from the bottom and follows a finger.',
  platform: 'mobile',
  description:
    'It rises over a scrim and rests at `snapPoints`, fractions of the screen height. Dragging the grip up grows it to the next height; dragging down shrinks it or closes it. A quick flick carries on to the next rest.\n\nWith `fit` it is as tall as its content instead. On the desktop it is a centred column up to 640px wide. MenuFlyout, ContextMenu and Select use it on mobile.',
  related: ['Dialog', 'MenuFlyout', 'Select'],
  examples: ['Basic', 'Snap', 'Footer'],
  props: [
    { name: 'open', type: 'boolean', description: 'Controlled open state.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when uncontrolled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it opens or closes.' },
    { name: 'title', type: 'ReactNode', description: 'The heading; it names the sheet.' },
    { name: 'children', type: 'ReactNode', description: 'The content. It scrolls inside the sheet.' },
    { name: 'snapPoints', type: 'number[]', default: '[0.5, 0.92]', description: 'Rest heights as fractions of the viewport, smallest first. It opens at the first.' },
    { name: 'fit', type: 'boolean', default: 'false', description: 'As tall as the content, up to the largest snap point.' },
    { name: 'dismissible', type: 'boolean', default: 'true', description: 'The scrim, Escape and dragging down close it.' },
    { name: 'footer', type: 'ReactNode', description: 'Pinned under the content, above the safe area.' },
    { name: 'onExitComplete', type: '() => void', description: 'After the closing animation.' },
  ],
  accessibility: [
    '`role="dialog"` with `aria-modal`, named by the title. Focus is trapped inside and returns when it closes.',
    'Escape closes it when `dismissible`; dragging is never the only way to close it.',
  ],
} satisfies ComponentDoc
