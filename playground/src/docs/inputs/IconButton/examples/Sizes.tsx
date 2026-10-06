import { IconButton } from '@altern-digital/metro-ui'
import { VscHeart } from 'react-icons/vsc'

export const title = 'Sizes'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <IconButton icon={VscHeart} label="like" variant="default" size="sm" />
      <IconButton icon={VscHeart} label="like" variant="default" size="md" />
      <IconButton icon={VscHeart} label="like" variant="default" size="lg" />
    </div>
  )
}
