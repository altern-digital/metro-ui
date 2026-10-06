import type { ComponentDoc } from '../../types'

export default {
  name: 'SearchBox',
  category: 'inputs',
  summary: 'A text field with a search glyph button at its end.',
  platform: 'all',
  description:
    'Enter or the glyph button calls `onSearch` with the text; the glyph fills with the accent while pressed, as in Windows 8. Clearable by default. For live filtering use `onChange`; for a submitted query use `onSearch`. No suggestions dropdown, to stay light.',
  examples: ['Basic', 'Live'],
  props: [
    { name: 'onSearch', type: '(value: string) => void', description: 'On Enter or the search button.' },
    { name: 'searchLabel', type: 'string', default: 'locale.search', description: 'Spoken name of the search button.' },
    { name: 'clearable', type: 'boolean', default: 'true', description: 'An × button while there is text.' },
    { name: 'value', type: 'string', description: 'Controlled text.' },
    { name: 'defaultValue', type: 'string', description: 'Starting text, uncontrolled.' },
    { name: 'onChange', type: '(value: string, event: ChangeEvent | null) => void', description: 'Every edit.' },
    { name: '…', type: 'TextFieldProps', description: 'Every TextField prop except `type`, `multiline` and `suffix`.' },
  ],
  accessibility: ['An `<input type="search">` (role `searchbox`) with `enterkeyhint="search"`.', 'The search and clear buttons are real buttons named from the locale.'],
} satisfies ComponentDoc
