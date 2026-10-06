import { Select } from '@altern-digital/metro-ui'

export const title = 'Description, error and disabled'
export const description = 'Help text and errors are linked to the field for screen readers.'

const options = [
  { value: 'en', label: 'english' },
  { value: 'id', label: 'bahasa indonesia' },
  { value: 'nl', label: 'nederlands' },
]

export default function States() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
      <Select label="language" description="Used for menus and dates." options={options} defaultValue="en" />
      <Select label="language" error="pick a language" required options={options} />
      <Select label="language" disabled options={options} defaultValue="nl" />
    </div>
  )
}
