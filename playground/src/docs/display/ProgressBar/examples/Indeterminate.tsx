import { ProgressBar } from '@altern-digital/metro-ui'

export const title = 'Indeterminate'
export const description = 'The running dots, for work with no known end.'

export default function Indeterminate() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <ProgressBar />
      <ProgressBar label="connecting" tone="teal" />
    </div>
  )
}
