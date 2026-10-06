import { Segmented } from '@altern-digital/metro-ui'

export const title = 'Block'
export const description = 'Fills the width with equal segments.'

export default function Block() {
  return (
    <div style={{ maxWidth: 400 }}>
      <Segmented
        aria-label="filter"
        block
        defaultValue="all"
        options={[
          { value: 'all', label: 'all' },
          { value: 'unread', label: 'unread' },
          { value: 'flagged', label: 'flagged' },
        ]}
      />
    </div>
  )
}
