import { Radio, RadioGroup } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Controlled, with children'

export default function Children() {
  const [plan, setPlan] = useState('monthly')
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <RadioGroup label="Billing" value={plan} onChange={setPlan}>
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" description="Two months free." />
        <Radio value="lifetime" label="Lifetime" disabled />
      </RadioGroup>
      <span>picked: {plan}</span>
    </div>
  )
}
