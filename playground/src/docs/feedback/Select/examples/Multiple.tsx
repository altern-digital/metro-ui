import { Select } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Multiple'
export const description = 'Pick several values; the list stays open. On mobile an ok button closes the sheet.'

export default function Multiple() {
  const [days, setDays] = useState<string[]>(['mon', 'wed'])
  return (
    <Select
      multiple
      label="repeat on"
      value={days}
      onChange={setDays}
      clearable
      style={{ width: 280 }}
      options={['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((d) => ({ value: d, label: d }))}
    />
  )
}
