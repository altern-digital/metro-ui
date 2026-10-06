import { Button, PullToRefresh } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscRefresh } from 'react-icons/vsc'

export const title = 'Basic'
export const description = 'Pull the list down on a touch screen (or a phone-sized emulator). The button does the same for a mouse.'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function Basic() {
  const [items, setItems] = useState(['item 3', 'item 2', 'item 1'])
  const refresh = async () => {
    await wait(1500)
    setItems((all) => [`item ${all.length + 1}`, ...all])
  }
  return (
    <div style={{ width: 360, maxWidth: '100%' }}>
      <Button icon={VscRefresh} onClick={refresh}>refresh</Button>
      <PullToRefresh onRefresh={refresh} style={{ height: 300, marginTop: 8, border: '1px solid var(--mt-border)' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((item) => (
            <li key={item} style={{ padding: '14px 16px', borderBottom: '1px solid var(--mt-border)' }}>
              {item}
            </li>
          ))}
        </ul>
      </PullToRefresh>
    </div>
  )
}
