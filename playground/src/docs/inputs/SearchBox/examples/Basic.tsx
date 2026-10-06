import { SearchBox } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Basic'
export const description = 'Press Enter or the glyph.'

export default function Basic() {
  const [query, setQuery] = useState<string | null>(null)
  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
      <SearchBox aria-label="search apps" placeholder="search apps" onSearch={setQuery} />
      {query !== null && <span>searched for “{query}”</span>}
    </div>
  )
}
