import { TextField } from '@altern-digital/metro-ui'
import { VscGlobe, VscMail } from 'react-icons/vsc'

export const title = 'Prefix and suffix'
export const description = 'Icons or units inside the field.'

export default function Sections() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
      <TextField label="Email" prefix={<VscMail />} placeholder="you@example.com" />
      <TextField label="Website" prefix={<VscGlobe />} suffix=".com" placeholder="example" />
      <TextField label="Weight" type="number" defaultValue="72" suffix="kg" block={false} />
    </div>
  )
}
