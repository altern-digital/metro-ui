import { TimePicker } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'TimePicker'
export const description = 'Shown in 12 hours, stored as 24-hour HH:mm.'

export default function Time() {
  const [time, setTime] = useState('07:30')
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'start' }}>
      <TimePicker value={time} onChange={setTime} use12Hours minuteStep={5} />
      <TimePicker value={time} onChange={setTime} rows={3} />
      <span>{time}</span>
    </div>
  )
}
