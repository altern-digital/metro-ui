import { Pagination } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscMail } from 'react-icons/vsc'

export const title = 'Paging a list'
export const description = 'Give count and pageSize, and hold the page yourself.'

const MAIL = Array.from({ length: 47 }, (_, i) => `message ${i + 1}`)
const SIZE = 5

export default function Items() {
  const [page, setPage] = useState(1)
  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0, minHeight: 150 }}>
        {MAIL.slice((page - 1) * SIZE, page * SIZE).map((m) => (
          <li key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
            <VscMail /> {m}
          </li>
        ))}
      </ul>
      <Pagination count={MAIL.length} pageSize={SIZE} page={page} onChange={setPage} siblings={2} />
    </div>
  )
}
