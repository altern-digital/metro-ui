import { Pagination } from '@altern-digital/metro-ui'

export const title = 'Simple'
export const description = 'The phone form, here forced on: arrows and the page count.'

export default function Simple() {
  return <Pagination simple total={12} defaultPage={3} />
}
