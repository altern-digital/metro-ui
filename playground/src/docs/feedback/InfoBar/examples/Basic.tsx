import { InfoBar } from '@altern-digital/metro-ui'

export const title = 'Basic'
export const description = 'A message with the default info severity.'

export default function Basic() {
  return <InfoBar title="offline" message="Changes are saved on this device and sync when you reconnect." />
}
