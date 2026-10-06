import type { ComponentDoc } from '../../types'

export default {
  name: 'SplitView',
  category: 'layout',
  summary: 'A list pane beside a detail pane, resizable on desktop, one at a time on mobile.',
  platform: 'adaptive',
  description:
    'SplitView is the master–detail layout of Mail and Settings. On desktop the pane sits beside the detail; with `resizable` its edge can be dragged, or moved with the arrow keys. On mobile it shows one at a time: the pane, or the detail when `showDetail` is set, so selecting an item navigates forward.\n\nThe width is uncontrolled by default; pass `paneWidth` and `onPaneWidthChange` to keep it yourself, for example to remember it.',
  examples: ['Basic', 'MasterDetail'],
  props: [
    { name: 'pane', type: 'ReactNode', required: true, description: 'The side pane, usually a list.' },
    { name: 'children', type: 'ReactNode', description: 'The detail.' },
    { name: 'paneWidth', type: 'number', description: 'Pane width in px, when controlled.' },
    { name: 'defaultPaneWidth', type: 'number', default: '320', description: 'Starting width, when uncontrolled.' },
    { name: 'onPaneWidthChange', type: '(width: number) => void', description: 'Called while resizing.' },
    { name: 'minPaneWidth', type: 'number', default: '200', description: 'Narrowest the pane can be dragged.' },
    { name: 'maxPaneWidth', type: 'number', default: '600', description: 'Widest the pane can be dragged.' },
    { name: 'panePosition', type: "'left' | 'right'", default: "'left'", description: 'Which side the pane is on.' },
    { name: 'resizable', type: 'boolean', default: 'false', description: 'Show a drag handle on the pane edge.' },
    { name: 'collapsed', type: 'boolean', default: 'false', description: 'Hide the pane on desktop.' },
    { name: 'showDetail', type: 'boolean', default: 'false', description: 'On mobile, show the detail instead of the pane.' },
    { name: 'platform', type: "'mobile' | 'desktop' | 'auto'", default: "'auto'", description: 'Force a form instead of following the provider.' },
    { name: 'resizeLabel', type: 'string', default: "'resize pane'", description: 'Spoken name of the drag handle.' },
  ],
  accessibility: [
    'The handle is a focusable `separator` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`.',
    'Left and Right move it 16px (64px with Shift); Home and End jump to the limits.',
  ],
} satisfies ComponentDoc
