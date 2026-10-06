import { PullToRefresh } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscMail } from 'react-icons/vsc'

export const title = 'Custom labels and threshold'
export const description = 'A longer pull, with your own words.'

export default function Labels() {
  const [checked, setChecked] = useState(() => new Date().toLocaleTimeString())
  return (
    <PullToRefresh
      threshold={100}
      pullLabel="pull to check mail"
      releaseLabel="let go to check"
      onRefresh={() => new Promise<void>((r) => setTimeout(() => (setChecked(new Date().toLocaleTimeString()), r()), 1200))}
      style={{ height: 260, width: 360, maxWidth: '100%', border: '1px solid var(--mt-border)' }}
    >
      <p style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
        <VscMail /> last checked {checked}
      </p>
    </PullToRefresh>
  )
}
