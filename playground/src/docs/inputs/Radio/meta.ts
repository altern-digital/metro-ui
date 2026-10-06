import type { ComponentDoc } from '../../types'

export default {
  name: 'Radio',
  category: 'inputs',
  summary: 'Pick one of a few choices: round buttons in a RadioGroup.',
  platform: 'all',
  description:
    'Put `Radio`s in a `RadioGroup`, or pass the group `options` as data. The group owns the value, the shared `name` and `disabled`. The circle is one of the few round shapes Metro keeps, as Windows Phone did; the picked one gets an accent ring and a dot.\n\nA lone `Radio` also works, with its own `checked`/`onChange`. For two to five short choices in a row, Segmented is often better.',
  related: ['RadioGroup', 'Segmented'],
  examples: ['Basic', 'Children', 'Horizontal'],
  props: [
    { name: 'value', type: 'string', required: true, description: "What the group's value becomes when this one is picked." },
    { name: 'label', type: 'ReactNode', description: 'Beside the circle.' },
    { name: 'description', type: 'ReactNode', description: 'Smaller muted text under the label, linked with `aria-describedby`.' },
    { name: 'checked', type: 'boolean', description: 'Outside a group only: controlled state.' },
    { name: 'defaultChecked', type: 'boolean', description: 'Outside a group only: starting state.' },
    { name: 'onChange', type: '(checked: boolean, event: ChangeEvent) => void', description: 'Fires when this radio is picked.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'This one cannot be picked.' },
    { name: 'className', type: 'string', description: 'On the root `<label>`; other native props go on the `<input>`.' },
    { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'The native radio.' },
  ],
  extraProps: {
    RadioGroup: [
      { name: 'options', type: '{ value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }[]', description: 'The radios as data. Or pass `<Radio>` children.' },
      { name: 'value', type: 'string | null', description: 'Controlled picked value.' },
      { name: 'defaultValue', type: 'string | null', description: 'Starting value, uncontrolled.' },
      { name: 'onChange', type: '(value: string) => void', description: 'The newly picked value.' },
      { name: 'name', type: 'string', default: 'generated', description: 'Shared `name` of the radios, for forms.' },
      { name: 'label', type: 'ReactNode', description: "Above the radios, muted and lowercase; the group's spoken name." },
      { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Stack or row.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Every radio disabled.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'The group element.' },
    ],
  },
  accessibility: [
    'Native radios sharing a `name`: arrow keys move and pick, Tab enters at the picked one.',
    'The group is `role="radiogroup"`, named by its `label` via `aria-labelledby`.',
    'Descriptions are linked with `aria-describedby`, not read as part of the name.',
  ],
} satisfies ComponentDoc
