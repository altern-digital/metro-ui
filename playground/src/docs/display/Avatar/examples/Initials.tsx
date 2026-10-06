import { Avatar } from '@altern-digital/metro-ui'

export const title = 'Initials'
export const description = 'Each name gets its own tone, the same every time.'

export default function Initials() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Linus Torvalds', 'Margaret Hamilton'].map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </div>
  )
}
