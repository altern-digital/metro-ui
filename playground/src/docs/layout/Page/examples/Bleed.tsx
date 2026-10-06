import { Page } from '@altern-digital/metro-ui'

export const title = 'Bleed'
export const description = 'The body runs edge to edge.'

export default function Bleed() {
  return (
    <div style={{ height: 240, border: '1px solid var(--mt-border)' }}>
      <Page title="photos" bleed>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {['blue', 'teal', 'orange', 'purple', 'green', 'red', 'amber', 'cyan'].map((tone) => (
            <div key={tone} style={{ aspectRatio: '1', background: `var(--mt-tone-${tone})` }} />
          ))}
        </div>
      </Page>
    </div>
  )
}
