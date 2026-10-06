import { Tag } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Removable'

export default function Removable() {
  const [tags, setTags] = useState(['frontend', 'backend', 'infra'])
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tags.map((t) => (
        <Tag key={t} tone="accent" removeLabel={`remove ${t}`} onRemove={() => setTags((all) => all.filter((x) => x !== t))}>
          {t}
        </Tag>
      ))}
    </div>
  )
}
