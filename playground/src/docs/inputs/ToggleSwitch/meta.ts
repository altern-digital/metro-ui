import type { ComponentDoc } from '../../types'

export default {
  name: 'ToggleSwitch',
  category: 'inputs',
  summary: 'The Windows 8 on/off switch: a square track with a block thumb, and "on"/"off" beside it.',
  platform: 'all',
  description:
    'For a setting that takes effect at once. The setting name sits above, muted and lowercase; the state text sits beside the track. The track fills with the accent when on and the thumb slides across. Use a Checkbox instead when the choice is applied later by a submit button.\n\n`className` and `style` go on the root; other native props and `ref` go on the hidden `<input>`.',
  related: ['Checkbox'],
  examples: ['Basic', 'Controlled', 'States'],
  props: [
    { name: 'label', type: 'ReactNode', description: "The setting's name, above the switch. Also its spoken name." },
    { name: 'checked', type: 'boolean', description: 'Controlled state.' },
    { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Starting state, uncontrolled.' },
    { name: 'onChange', type: '(checked: boolean, event: ChangeEvent) => void', description: 'The new state.' },
    { name: 'onLabel', type: 'ReactNode', default: "'on'", description: 'Text beside the switch while on. `null` hides the state text.' },
    { name: 'offLabel', type: 'ReactNode', default: "'off'", description: 'Text beside the switch while off.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Not toggleable, dimmed.' },
    { name: 'className', type: 'string', description: 'On the root `<label>`.' },
    { name: 'style', type: 'CSSProperties', description: 'On the root `<label>`.' },
    { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'The native input.' },
  ],
  accessibility: [
    'A native checkbox with `role="switch"`: Space toggles, read as on/off.',
    'The state text is hidden from screen readers, which already announce the state.',
  ],
} satisfies ComponentDoc
