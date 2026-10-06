import type { ComponentDoc } from '../../types'

export default {
  name: 'PasswordBox',
  category: 'inputs',
  summary: 'A TextField for passwords, with an eye button that reveals what was typed.',
  platform: 'all',
  description:
    'In `toggle` mode the eye shows the password until pressed again. In `peek` mode it shows only while held down, as Windows 8 did. Everything else is a TextField: label, description, error, prefix, clearable, controlled or not.',
  examples: ['Basic', 'Peek'],
  props: [
    { name: 'revealMode', type: "'toggle' | 'peek'", default: "'toggle'", description: 'Toggle on press, or show only while held.' },
    { name: 'noReveal', type: 'boolean', default: 'false', description: 'No reveal button.' },
    { name: 'showLabel', type: 'string', default: 'locale.showPassword', description: 'Spoken name of the reveal button.' },
    { name: 'hideLabel', type: 'string', default: 'locale.hidePassword', description: 'Its name while revealed (toggle mode).' },
    { name: 'autoComplete', type: 'string', default: "'current-password'", description: "Use `'new-password'` on sign-up forms." },
    { name: '…', type: 'TextFieldProps', description: 'Every TextField prop except `type`, `multiline` and `suffix`.' },
  ],
  accessibility: [
    'The reveal button is a real button with `aria-pressed`, named from the locale.',
    'In peek mode, holding Space or Enter on the button reveals it from the keyboard.',
    'The caret stays in the field when the button is pressed.',
  ],
} satisfies ComponentDoc
