import { Picker } from '@altern-digital/metro-ui'

export const title = 'Basic'

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => ({ value: s, label: s }))

export default function Basic() {
  return <Picker columns={[{ key: 'size', options: sizes }]} defaultValue={{ size: 'M' }} />
}
