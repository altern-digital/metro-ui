import { BarChart } from '@altern-digital/metro-ui'

export const title = 'Vertical'
export const description = 'Columns on a heavy baseline, values on top.'

export default function Vertical() {
  return (
    <BarChart
      label="rides per month"
      data={[
        { label: 'may', value: 42 },
        { label: 'jun', value: 58 },
        { label: 'jul', value: 71 },
        { label: 'aug', value: 66 },
        { label: 'sep', value: 49 },
        { label: 'oct', value: 37 },
      ]}
    />
  )
}
