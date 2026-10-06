import { Button, JumpList } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscListOrdered } from 'react-icons/vsc'

export const title = 'Your own tiles'
export const description = 'Any tiles work, such as years. onJump tells you which one was picked.'

const YEARS = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026']

export default function Alphabet() {
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <div>
      <Button icon={VscListOrdered} onClick={() => setOpen(true)}>pick a year</Button>
      <p>{picked ? `jumped to ${picked}` : 'no year picked'}</p>
      <JumpList open={open} onOpenChange={setOpen} alphabet={YEARS} groups={['2020', '2023', '2024', '2026']} onJump={setPicked} label="jump to a year" />
    </div>
  )
}
