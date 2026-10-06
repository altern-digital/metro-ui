import { RadioGroup } from '@altern-digital/metro-ui'

export const title = 'Basic'

export default function Basic() {
  return (
    <RadioGroup
      label="Theme"
      defaultValue="dark"
      options={[
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' },
        { value: 'system', label: 'Match the system', description: 'Follows your device setting.' },
      ]}
    />
  )
}
