import { Grid } from '@altern-digital/metro-ui'

export const title = 'Fixed columns'

export default function Fixed() {
  return (
    <Grid columns={3} gap={2}>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} style={{ padding: 16, background: 'var(--mt-raised)' }}>{n}</div>
      ))}
    </Grid>
  )
}
