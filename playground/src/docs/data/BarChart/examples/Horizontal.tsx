import { BarChart } from '@altern-digital/metro-ui'

export const title = 'Horizontal'
export const description = 'Rows, for long labels. Values formatted as currency.'

export default function Horizontal() {
  return (
    <BarChart
      orientation="horizontal"
      label="spending by category"
      tone="teal"
      format={(n) => `$${n.toLocaleString()}`}
      data={[
        { label: 'housing', value: 1450 },
        { label: 'groceries', value: 620 },
        { label: 'travel', value: 310 },
        { label: 'utilities', value: 225 },
        { label: 'entertainment', value: 140 },
      ]}
    />
  )
}
