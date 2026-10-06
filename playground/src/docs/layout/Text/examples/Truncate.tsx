import { Text } from '@altern-digital/metro-ui'

export const title = 'Truncate'
export const description = 'One line with an ellipsis; the title attribute shows the rest on hover.'

export default function Truncate() {
  const path = '/projects/contoso/design/reviews/2026/october/final-final-v3.pdf'
  return (
    <div style={{ width: 240 }}>
      <Text as="p" truncate mono title={path}>{path}</Text>
    </div>
  )
}
