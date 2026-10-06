import { TextField } from '@altern-digital/metro-ui'

export const title = 'Multiline'
export const description = 'A textarea; with autoResize it grows as you type.'

export default function Multiline() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
      <TextField label="Notes" multiline rows={3} />
      <TextField label="Message" multiline autoResize rows={2} placeholder="Type a few lines…" />
    </div>
  )
}
