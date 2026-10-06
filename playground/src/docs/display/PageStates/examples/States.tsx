import { Button, PageStates, Text } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'The four states'

const STATES = ['loading', 'empty', 'error', 'ready'] as const
type State = (typeof STATES)[number]

export default function States() {
  const [state, setState] = useState<State>('loading')
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {STATES.map((s) => (
          <Button key={s} variant={s === state ? 'primary' : 'default'} onClick={() => setState(s)}>
            {s}
          </Button>
        ))}
      </div>
      <PageStates state={state} error={new Error('the server took too long to answer.')} onRetry={() => setState('loading')}>
        <Text>here are your 12 projects.</Text>
      </PageStates>
    </div>
  )
}
