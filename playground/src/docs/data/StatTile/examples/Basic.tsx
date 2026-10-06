import { StatTile } from '@altern-digital/metro-ui'
import { VscCreditCard, VscGraph, VscPerson } from 'react-icons/vsc'

export const title = 'Basic'
export const description = 'Rising is green, falling is red, unless invertDelta says falling is good.'

const pct = (d: number) => `${d}%`

export default function Basic() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
      <StatTile icon={VscPerson} label="active users" value={18420} delta={6.2} formatDelta={pct} caption="vs last week" />
      <StatTile icon={VscGraph} label="conversion" value="3.4%" delta={-0.8} formatDelta={pct} caption="vs last week" />
      <StatTile icon={VscCreditCard} label="refunds" value={42} delta={-12} invertDelta caption="this month" />
    </div>
  )
}
