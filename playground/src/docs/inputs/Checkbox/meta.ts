import type { ComponentDoc } from '../../types'

export default {
  name: 'Checkbox',
  category: 'inputs',
  summary: 'A square box that fills with the accent and shows a check when on.',
  platform: 'all',
  description:
    'A native checkbox under a drawn square box, so forms, keyboard and screen readers work as usual. `indeterminate` shows a bar for "some of these", as in a select-all row. `className` and `style` go on the root `<label>`; every other native prop and `ref` go on the `<input>`.',
  examples: ['Basic', 'Indeterminate', 'States'],
  props: [
    { name: 'label', type: 'ReactNode', description: 'Beside the box. Clicking it toggles the box.' },
    { name: 'description', type: 'ReactNode', description: 'Smaller muted text under the label, linked with `aria-describedby`.' },
    { name: 'checked', type: 'boolean', description: 'Controlled state.' },
    { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Starting state, uncontrolled.' },
    { name: 'onChange', type: '(checked: boolean, event: ChangeEvent) => void', description: 'The new state.' },
    { name: 'indeterminate', type: 'boolean', default: 'false', description: 'A bar instead of a check; read as "mixed".' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Not toggleable, dimmed.' },
    { name: 'className', type: 'string', description: 'On the root `<label>`.' },
    { name: 'style', type: 'CSSProperties', description: 'On the root `<label>`.' },
    { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'The native checkbox.' },
  ],
  accessibility: [
    'A real `<input type="checkbox">`: Space toggles, the label names it.',
    '`indeterminate` sets the native property, so it is read as "mixed".',
    'The focus ring is drawn on the visible box.',
  ],
} satisfies ComponentDoc
