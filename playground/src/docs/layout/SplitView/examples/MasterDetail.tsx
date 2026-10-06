import { Button, SplitView, Stack, Text } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Master and detail'
export const description = 'On a phone, picking a message shows it full screen and back returns to the list.'

const MESSAGES = ['welcome aboard', 'your weekly summary', 'meeting moved to 3pm']

export default function MasterDetail() {
  const [selected, setSelected] = useState<number | null>(null)
  const list = (
    <Stack gap={0}>
      {MESSAGES.map((m, i) => (
        <Button key={m} variant="text" onClick={() => setSelected(i)} aria-pressed={selected === i}>
          {m}
        </Button>
      ))}
    </Stack>
  )
  return (
    <div style={{ height: 240, border: '1px solid var(--mt-border)' }}>
      <SplitView pane={list} showDetail={selected != null}>
        <Stack style={{ padding: 16 }}>
          <Button variant="text" onClick={() => setSelected(null)}>back</Button>
          <Text size="lg">{selected == null ? 'nothing selected' : MESSAGES[selected]}</Text>
        </Stack>
      </SplitView>
    </div>
  )
}
