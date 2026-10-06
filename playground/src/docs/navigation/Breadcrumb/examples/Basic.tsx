import { Breadcrumb } from '@altern-digital/metro-ui'
import { VscHome } from 'react-icons/vsc'

export const title = 'Basic'
export const description = 'Links for each parent; the last item is the current page.'

export default function Basic() {
  return (
    <Breadcrumb
      items={[
        { key: 'home', label: <VscHome aria-label="home" />, href: '#' },
        { key: 'docs', label: 'documents', href: '#' },
        { key: 'reports', label: 'reports', href: '#' },
        { key: 'q3', label: 'q3 summary' },
      ]}
    />
  )
}
