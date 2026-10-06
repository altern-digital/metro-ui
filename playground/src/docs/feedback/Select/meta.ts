import type { ComponentDoc } from '../../types'

export default {
  name: 'Select',
  category: 'feedback',
  summary: 'A field that opens a list to pick one or more values; a bottom sheet on mobile.',
  platform: 'adaptive',
  description:
    'A field-styled button that opens a flat list under it. On mobile the list is a bottom sheet of large rows. Values are strings.\n\nAdd `searchable` for long lists, `group` on options to list them under headings, `multiple` to pick several (the list stays open), and `clearable` for a button that empties it. With `name` the value is submitted with a form.',
  related: ['MenuFlyout', 'BottomSheet'],
  examples: ['Basic', 'Groups', 'Multiple', 'States'],
  props: [
    { name: 'options', type: 'SelectOption[]', required: true, description: 'The choices, in order.' },
    { name: 'value', type: 'string | null  (string[] when multiple)', description: 'Controlled value.' },
    { name: 'defaultValue', type: 'string | null  (string[] when multiple)', description: 'Initial value when uncontrolled.' },
    { name: 'onChange', type: '(value: string | null) => void  ((value: string[]) => void when multiple)', description: 'Called with the new value.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Pick several values.' },
    { name: 'label', type: 'ReactNode', description: 'Shown above the field and names it.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the field.' },
    { name: 'error', type: 'ReactNode', description: 'Turns the edge red and is announced with the field.' },
    { name: 'placeholder', type: 'ReactNode', default: "locale 'select'", description: 'Shown when nothing is chosen.' },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'A filter box at the top of the list.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'A button that empties the value.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Cannot be opened.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field required.' },
    { name: 'name', type: 'string', description: 'Submitted with a form through hidden inputs.' },
    { name: 'block', type: 'boolean', default: 'false', description: 'Full width.' },
    { name: 'platform', type: "'auto' | 'mobile' | 'desktop'", default: "'auto'", description: 'Force the dropdown or the sheet.' },
    { name: 'placement', type: 'Placement', default: "'bottom-start'", description: 'Where the dropdown opens.' },
    { name: 'searchPlaceholder', type: 'string', default: "locale 'search'", description: 'Placeholder of the filter box.' },
    { name: 'emptyText', type: 'ReactNode', default: "locale 'noOptions'", description: 'Shown when nothing matches.' },
  ],
  extraProps: {
    SelectOption: [
      { name: 'value', type: 'string', required: true, description: 'Unique value.' },
      { name: 'label', type: 'ReactNode', required: true, description: 'What is shown. Text labels are used for search and typing.' },
      { name: 'icon', type: 'IconSource', description: 'An icon before the label.' },
      { name: 'disabled', type: 'boolean', description: 'Shown but cannot be picked.' },
      { name: 'group', type: 'string', description: 'Lists the option under this heading.' },
    ],
  },
  accessibility: [
    'The field is a `combobox` button with `aria-expanded`, `aria-controls` and `aria-activedescendant`; the list is a `listbox`, `aria-multiselectable` when `multiple`.',
    'Up and Down move (skipping disabled options), Home and End jump, typing jumps to a match, Enter picks and Escape closes.',
    'Label, description and error are linked to the field.',
  ],
} satisfies ComponentDoc
