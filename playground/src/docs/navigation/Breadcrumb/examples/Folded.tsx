import { Breadcrumb } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Folded, with buttons'
export const description = 'maxItems folds the middle into "…". Items with onClick become buttons, here walking back up the path.'

const PATH = ['this pc', 'local disk', 'users', 'ana', 'projects', 'metro', 'src']

export default function Folded() {
  const [depth, setDepth] = useState(PATH.length)
  const path = PATH.slice(0, depth)
  return (
    <Breadcrumb
      maxItems={4}
      items={path.map((label, i) => ({
        key: label,
        label,
        onClick: i < path.length - 1 ? () => setDepth(i + 1) : undefined,
      }))}
    />
  )
}
