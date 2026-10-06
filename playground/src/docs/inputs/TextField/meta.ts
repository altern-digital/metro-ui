import type { ComponentDoc } from '../../types'

export default {
  name: 'TextField',
  category: 'inputs',
  summary: 'The Metro text box: a filled field whose underline turns accent on focus.',
  platform: 'all',
  description:
    'The label sits above, muted and lowercase. The edge turns accent while focused and red with `error`. `prefix` and `suffix` put an icon or a unit inside the field; `clearable` adds an × while there is text.\n\n`className` and `style` go on the root; every other native prop (`name`, `placeholder`, `type`, `autoComplete`, `ref`…) goes on the `<input>`, or the `<textarea>` with `multiline`. `onChange` receives the text first and the event second; the event is `null` when the clear button emptied the field.\n\nPasswordBox and SearchBox are built on it.',
  examples: ['Basic', 'States', 'Sections', 'Multiline', 'Controlled'],
  props: [
    { name: 'label', type: 'ReactNode', description: 'Above the field, muted and lowercase. Linked with `htmlFor`.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the field.' },
    { name: 'error', type: 'ReactNode', description: '`true` paints the edge red; a node also shows as red text under the field.' },
    { name: 'prefix', type: 'ReactNode', description: 'Inside the field, before the text.' },
    { name: 'suffix', type: 'ReactNode', description: 'Inside the field, after the text.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'An × button that empties the field while it has text.' },
    { name: 'clearLabel', type: 'string', default: 'locale.clear', description: 'Spoken name of the clear button.' },
    { name: 'multiline', type: 'boolean', default: 'false', description: 'A `<textarea>` instead of an `<input>`.' },
    { name: 'autoResize', type: 'boolean', default: 'false', description: 'With `multiline`, grow with the text.' },
    { name: 'rows', type: 'number', default: '3', description: 'With `multiline`, the starting number of lines.' },
    { name: 'value', type: 'string', description: 'Controlled text.' },
    { name: 'defaultValue', type: 'string', description: 'Starting text, uncontrolled.' },
    { name: 'onChange', type: '(value: string, event: ChangeEvent | null) => void', description: 'New text; `event` is `null` when cleared by the button.' },
    { name: 'block', type: 'boolean', default: 'true', description: 'Fill the width of its container.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Not editable, dimmed.' },
    { name: 'ref', type: 'Ref<HTMLInputElement | HTMLTextAreaElement>', description: 'The native field.' },
  ],
  accessibility: [
    'The label is a `<label for>` the field; the field id comes from `id` or `useId`.',
    'The description and error are linked with `aria-describedby`; an error sets `aria-invalid`.',
    'The clear button is a real button named by `locale.clear`.',
  ],
} satisfies ComponentDoc
