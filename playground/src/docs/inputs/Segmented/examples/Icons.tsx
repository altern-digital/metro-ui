import { Segmented } from '@altern-digital/metro-ui'
import { VscListFlat, VscListTree, VscSymbolArray } from 'react-icons/vsc'

export const title = 'Icons and sizes'

export default function Icons() {
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <Segmented
        aria-label="view"
        defaultValue="list"
        options={[
          { value: 'list', icon: VscListFlat, 'aria-label': 'list' },
          { value: 'tree', icon: VscListTree, 'aria-label': 'tree' },
          { value: 'grid', icon: VscSymbolArray, 'aria-label': 'grid' },
        ]}
      />
      <Segmented
        aria-label="view"
        size="sm"
        defaultValue="list"
        options={[
          { value: 'list', icon: VscListFlat, label: 'list' },
          { value: 'tree', icon: VscListTree, label: 'tree' },
        ]}
      />
    </div>
  )
}
