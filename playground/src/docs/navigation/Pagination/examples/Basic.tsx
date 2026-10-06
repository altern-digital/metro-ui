import { Pagination } from '@altern-digital/metro-ui'

export const title = 'Basic'
export const description = 'Twenty pages: the ends and the neighbours of the current page stay visible.'

export default function Basic() {
  return <Pagination total={20} defaultPage={7} />
}
