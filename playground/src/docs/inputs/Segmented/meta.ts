import type { ComponentDoc } from '../../types'

export default {
  name: 'Segmented',
  category: 'inputs',
  summary: 'A row of square segments; the picked one fills with the accent.',
  platform: 'all',
  description:
    'For two to five short, mutually exclusive choices that should all be visible: a view mode, a time range, a filter. Segments take text, an icon, or both; give an icon-only segment an `aria-label`. `block` stretches the row to the container with equal segments.',
  related: ['Radio'],
  examples: ['Basic', 'Icons', 'Block'],
  props: [
    { name: 'options', type: "{ value: string; label?: ReactNode; icon?: IconSource; disabled?: boolean; 'aria-label'?: string }[]", required: true, description: 'The segments.' },
    { name: 'value', type: 'string', description: 'Controlled picked value.' },
    { name: 'defaultValue', type: 'string', description: 'Starting value, uncontrolled.' },
    { name: 'onChange', type: '(value: string) => void', description: 'The newly picked value.' },
    { name: 'block', type: 'boolean', default: 'false', description: 'Fill the width, segments sharing it equally.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Height of the segments.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Every segment disabled.' },
    { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The row.' },
  ],
  accessibility: [
    'A `radiogroup` of `radio` buttons with `aria-checked`; name the row with `aria-label`.',
    'One Tab stop. Arrow keys, Home and End move and pick, skipping disabled segments.',
  ],
} satisfies ComponentDoc
