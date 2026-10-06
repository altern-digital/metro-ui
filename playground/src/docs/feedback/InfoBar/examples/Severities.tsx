import { InfoBar } from '@altern-digital/metro-ui'

export const title = 'Severities'
export const description = 'Info, success, warning and error each have a colour and glyph.'

export default function Severities() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <InfoBar severity="info" title="tip" message="Press Ctrl+K to search everything." />
      <InfoBar severity="success" title="backed up" message="All 2,413 files are in the cloud." />
      <InfoBar severity="warning" title="storage almost full" message="1.2 GB left." />
      <InfoBar severity="error" title="sync failed" message="We could not reach the server." />
    </div>
  )
}
