import type { ComponentDoc } from '../../types'

export default {
  name: 'SwipeItem',
  category: 'mobile',
  summary: 'A list row that slides aside under a finger to reveal actions.',
  platform: 'mobile',
  description:
    'Swipe right to reveal `leftActions`, left to reveal `rightActions`. The row snaps open past half the actions\' width, or on a flick, and springs back otherwise. With `fullSwipe`, dragging most of the way across runs the first action on that side. Running an action, or tapping the open row, closes it.\n\nWith a mouse the same actions show as icon buttons at the row\'s end on hover; with a keyboard they are in the tab order. So the actions work everywhere, not only on touch.',
  examples: ['Mail', 'FullSwipe'],
  props: [
    { name: 'leftActions', type: 'SwipeAction[]', default: '[]', description: '`{ key, label, icon?, tone?, onClick }`, revealed by swiping right.' },
    { name: 'rightActions', type: 'SwipeAction[]', default: '[]', description: 'Revealed by swiping left.' },
    { name: 'fullSwipe', type: 'boolean', default: 'false', description: 'Swiping most of the way across runs the first action on that side.' },
    { name: 'actionWidth', type: 'number', default: '72', description: 'Width of each revealed action, in px.' },
    { name: 'children', type: 'ReactNode', description: 'The row.' },
  ],
  extraProps: {
    SwipeAction: [
      { name: 'tone', type: "'danger' | 'warning' | 'success' | 'info' | 'accent' | Tone", default: "'accent'", description: 'The action\'s fill: a status, a Metro tone, or any CSS colour.' },
    ],
  },
  accessibility: [
    'Each action is also a named icon button at the row\'s end, reachable by mouse and keyboard.',
    'The actions behind the row are `inert` and hidden from screen readers until revealed.',
    'A swipe only starts from touch or pen; a mouse drag selects text as usual.',
  ],
} satisfies ComponentDoc
