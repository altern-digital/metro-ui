import { Subtitle, Title } from '@altern-digital/metro-ui'

export const title = 'With a subtitle'
export const description = 'keepCase keeps a proper name as written.'

export default function WithSubtitle() {
  return (
    <div>
      <Title keepCase>Contoso</Title>
      <Subtitle>12 projects, 3 shared with you</Subtitle>
    </div>
  )
}
