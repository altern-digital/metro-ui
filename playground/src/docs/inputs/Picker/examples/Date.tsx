import { DatePicker } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'DatePicker'
export const description = 'Day and month wrap around; the day is clamped to the month.'

export default function DateExample() {
  const [date, setDate] = useState(() => new Date())
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <DatePicker value={date} onChange={setDate} />
      <span>{date.toDateString()}</span>
    </div>
  )
}
