import { Avatar } from '@altern-digital/metro-ui'

export const title = 'Pictures and presence'
export const description = 'The last picture fails to load and falls back to initials.'

export default function Pictures() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Avatar name="Ada Lovelace" src="https://i.pravatar.cc/128?img=47" status="online" size="lg" />
      <Avatar name="Alan Turing" src="https://i.pravatar.cc/128?img=12" status="away" size="lg" shape="circle" />
      <Avatar name="Grace Hopper" src="/missing.png" status="busy" size="lg" />
      <Avatar name="Dennis Ritchie" status="offline" size="lg" />
    </div>
  )
}
