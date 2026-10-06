import { BarChart } from '@altern-digital/metro-ui'

export const title = 'Tones and max'
export const description = 'Each bar can take a tone. A fixed max keeps charts comparable.'

export default function Tones() {
  return (
    <BarChart
      label="storage used, of 64 GB"
      max={64}
      height={160}
      format={(n) => `${n} GB`}
      data={[
        { label: 'apps', value: 18, tone: 'blue' },
        { label: 'photos', value: 24, tone: 'orange' },
        { label: 'music', value: 9, tone: 'purple' },
        { label: 'other', value: 4, tone: 'gray' },
      ]}
    />
  )
}
