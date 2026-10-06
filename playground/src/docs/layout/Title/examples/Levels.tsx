import { Title } from '@altern-digital/metro-ui'

export const title = 'Levels'
export const description = 'Four steps, from the hub title down to a group heading.'

export default function Levels() {
  return (
    <div>
      <Title>people</Title>
      <Title level={2}>recent</Title>
      <Title level={3}>favourites</Title>
      <Title level={4}>details</Title>
    </div>
  )
}
