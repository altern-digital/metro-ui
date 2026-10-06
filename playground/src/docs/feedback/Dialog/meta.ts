import type { ComponentDoc } from '../../types'

export default {
  name: 'Dialog',
  category: 'feedback',
  summary: 'A modal band across the screen that asks one question; full screen on mobile.',
  platform: 'adaptive',
  description:
    'On the desktop it is a band across the middle of the screen over a scrim, with a light lowercase title and the buttons on the right. On mobile it is a full-screen page that rises from the bottom, with a close button.\n\nGive buttons as `actions`. An action closes the dialog unless its `onClick` returns `false`; if it returns a promise, the button shows loading until it settles. Focus stays inside while it is open and goes back where it was after.\n\nFor quick questions in the middle of a handler, `useDialog()` gives `confirm`, `alert` and `prompt` as promises.',
  related: ['useDialog', 'BottomSheet', 'InfoBar'],
  examples: ['Basic', 'Confirm', 'Prompt', 'Async', 'Form'],
  props: [
    { name: 'open', type: 'boolean', description: 'Controlled open state.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when uncontrolled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it opens or closes.' },
    { name: 'title', type: 'ReactNode', description: 'The heading; it names the dialog.' },
    { name: 'children', type: 'ReactNode', description: 'The body; it describes the dialog.' },
    { name: 'actions', type: 'DialogAction[]', description: 'Buttons along the bottom, in order.' },
    { name: 'footer', type: 'ReactNode', description: 'Your own footer instead of `actions`.' },
    { name: 'dismissible', type: 'boolean', default: 'true', description: 'Escape, the scrim and the mobile close button close it.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Content width on the desktop: 440, 560 or 760px.' },
    { name: 'platform', type: "'auto' | 'mobile' | 'desktop'", default: "'auto'", description: 'Force the band or the full-screen page.' },
    { name: 'closeLabel', type: 'string', default: "locale 'close'", description: 'Label of the mobile close button.' },
    { name: 'onExitComplete', type: '() => void', description: 'After the closing animation.' },
  ],
  extraProps: {
    DialogAction: [
      { name: 'label', type: 'ReactNode', required: true, description: 'The button text.' },
      { name: 'variant', type: 'ButtonVariant', description: 'Button style, e.g. `accent` or `danger`.' },
      { name: 'onClick', type: '() => void | boolean | Promise<void | boolean>', description: 'Return `false` to keep the dialog open; a promise shows loading.' },
      { name: 'autoFocus', type: 'boolean', description: 'Takes focus when the dialog opens.' },
      { name: 'disabled', type: 'boolean', description: 'Cannot be pressed.' },
    ],
    'useDialog()': [
      { name: 'confirm', type: '(options: DialogOptions) => Promise<boolean>', description: '`true` on OK, `false` on cancel, Escape or the scrim.' },
      { name: 'alert', type: '(options: DialogOptions) => Promise<void>', description: 'Resolves once dismissed.' },
      { name: 'prompt', type: '(options: PromptOptions) => Promise<string | null>', description: 'The text on OK or Enter, `null` otherwise.' },
    ],
    DialogOptions: [
      { name: 'title', type: 'ReactNode', description: 'The heading.' },
      { name: 'content', type: 'ReactNode', description: 'The body.' },
      { name: 'okText', type: 'ReactNode', default: "locale 'ok'", description: 'OK button text.' },
      { name: 'cancelText', type: 'ReactNode', default: "locale 'cancel'", description: 'Cancel button text.' },
      { name: 'danger', type: 'boolean', description: 'Red OK button, focus starts on cancel, `role="alertdialog"`.' },
      { name: 'defaultValue', type: 'string', description: 'prompt only: the starting text.' },
      { name: 'placeholder', type: 'string', description: 'prompt only: the field placeholder.' },
      { name: 'inputLabel', type: 'string', description: 'prompt only: names the field. Defaults to the title when it is text.' },
    ],
  },
  accessibility: [
    '`role="dialog"` with `aria-modal`, named by the title and described by the body; `alertdialog` for dangerous confirms.',
    'Focus is trapped inside and returns to where it was when the dialog closes. The page behind does not scroll.',
    'Escape closes it when `dismissible`.',
  ],
} satisfies ComponentDoc
