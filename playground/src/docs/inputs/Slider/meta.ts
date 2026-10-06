import type { ComponentDoc } from '../../types'

export default {
  name: 'Slider',
  category: 'inputs',
  summary: 'A thin track with a tall rectangular thumb; the part before it fills with the accent.',
  platform: 'all',
  description:
    'A styled native `<input type="range">`, so keyboard, touch and screen readers work for free. `onChange` fires on every step for live preview; `onChangeEnd` fires once when the pointer or key lets go, for saving. `tooltip` shows the value over the thumb while dragging or focused, formatted by `formatValue`.\n\n`className` and `style` go on the root; other native props and `ref` go on the `<input>`. Give it an `aria-label` or a `<label for>`.',
  examples: ['Basic', 'Tooltip', 'Controlled'],
  props: [
    { name: 'min', type: 'number', default: '0', description: 'Lowest value.' },
    { name: 'max', type: 'number', default: '100', description: 'Highest value.' },
    { name: 'step', type: 'number', default: '1', description: 'Granularity.' },
    { name: 'value', type: 'number', description: 'Controlled value.' },
    { name: 'defaultValue', type: 'number', default: 'min', description: 'Starting value, uncontrolled.' },
    { name: 'onChange', type: '(value: number) => void', description: 'Every change while dragging or pressing keys.' },
    { name: 'onChangeEnd', type: '(value: number) => void', description: 'When the pointer lets go or a key is released.' },
    { name: 'tooltip', type: 'boolean', default: 'false', description: 'Show the value over the thumb while dragged or focused.' },
    { name: 'formatValue', type: '(value: number) => ReactNode', description: 'How the tooltip shows the value; a string result is also used as `aria-valuetext`.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Not movable, dimmed.' },
    { name: 'className', type: 'string', description: 'On the root.' },
    { name: 'style', type: 'CSSProperties', description: 'On the root.' },
    { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'The native range input.' },
  ],
  accessibility: [
    'A native range input: arrows, Page Up/Down, Home and End all work.',
    'A string from `formatValue` is spoken via `aria-valuetext` ("40%" rather than "40").',
    'Needs a name: `aria-label`, `aria-labelledby` or a `<label for>`.',
  ],
} satisfies ComponentDoc
