import { RadioGroup } from '@altern-digital/metro-ui'

export const title = 'Horizontal'

export default function Horizontal() {
  return (
    <RadioGroup
      label="Size"
      orientation="horizontal"
      defaultValue="m"
      options={[
        { value: 's', label: 'Small' },
        { value: 'm', label: 'Medium' },
        { value: 'l', label: 'Large' },
      ]}
    />
  )
}
