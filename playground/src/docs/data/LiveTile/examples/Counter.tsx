import { Button, LiveTile } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscMail } from 'react-icons/vsc'

export const title = 'Counter'
export const description = 'The number counts up to each new value.'

export default function Counter() {
  const [unread, setUnread] = useState(3)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
      <LiveTile
        size="wide"
        tone="blue"
        icon={VscMail}
        title="mail"
        counter={unread}
        faces={[
          <div key="a"><div style={{ fontSize: 16 }}>Invoice #2041</div><div style={{ opacity: 0.8 }}>accounts</div></div>,
          <div key="b"><div style={{ fontSize: 16 }}>Re: launch plan</div><div style={{ opacity: 0.8 }}>dewi</div></div>,
        ]}
      />
      <Button onClick={() => setUnread((n) => n + 5)}>5 more</Button>
    </div>
  )
}
