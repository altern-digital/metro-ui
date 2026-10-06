import { EmptyState } from '@altern-digital/metro-ui'
import { VscSearch } from 'react-icons/vsc'

export const title = 'Aligned to the start'
export const description = 'For a result list inside a page.'

export default function Start() {
  return <EmptyState align="start" icon={VscSearch} title="no results" description="try fewer words, or check the spelling." />
}
