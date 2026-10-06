import { Select } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Basic'
export const description = 'A label and a few options.'

export default function Basic() {
  const [size, setSize] = useState<string | null>('m')
  return (
    <Select
      label="text size"
      value={size}
      onChange={setSize}
      options={[
        { value: 's', label: 'small' },
        { value: 'm', label: 'medium' },
        { value: 'l', label: 'large' },
      ]}
    />
  )
}
