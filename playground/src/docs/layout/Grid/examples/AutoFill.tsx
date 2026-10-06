import { Grid } from '@altern-digital/metro-ui'

export const title = 'Auto-fill'
export const description = 'As many 120px columns as fit.'

export default function AutoFill() {
  return (
    <Grid minChildWidth={120} gap={1}>
      {Array.from({ length: 10 }, (_, n) => (
        <div key={n} style={{ height: 60, background: 'var(--mt-raised)' }} />
      ))}
    </Grid>
  )
}
