import { Grid } from '@altern-digital/metro-ui'

export const title = 'Per breakpoint'
export const description = 'One column on a phone, two on a tablet, four on a desktop. Resize the window.'

export default function Responsive() {
  return (
    <Grid columns={{ compact: 1, medium: 2, expanded: 4 }}>
      {['blue', 'teal', 'orange', 'purple'].map((tone) => (
        <div key={tone} style={{ height: 80, background: `var(--mt-tone-${tone})` }} />
      ))}
    </Grid>
  )
}
