import { Page, Text } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Back'
export const description = 'onBack shows the Metro back arrow.'

export default function WithBack() {
  const [count, setCount] = useState(0)
  return (
    <div style={{ height: 240, border: '1px solid var(--mt-border)' }}>
      <Page title="settings" onBack={() => setCount((n) => n + 1)}>
        <Text>back pressed {count} times</Text>
      </Page>
    </div>
  )
}
