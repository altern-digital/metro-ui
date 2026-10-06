import { Button, Pivot } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscArrowRight } from 'react-icons/vsc'

export const title = 'Controlled, medium'
export const description = 'Hold the selected key yourself to move between views from elsewhere.'

const KEYS = ['music', 'videos', 'podcasts']

export default function Controlled() {
  const [value, setValue] = useState('music')
  const next = () => setValue(KEYS[(KEYS.indexOf(value) + 1) % KEYS.length]!)
  return (
    <div>
      <Pivot
        size="md"
        value={value}
        onChange={setValue}
        items={KEYS.map((key) => ({ key, label: key, content: <p style={{ margin: '16px 0' }}>{key} in your collection</p> }))}
      />
      <Button icon={VscArrowRight} onClick={next}>next</Button>
    </div>
  )
}
