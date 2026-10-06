import { JumpList, JumpListHeader } from '@altern-digital/metro-ui'
import { useState } from 'react'
import { VscPerson } from 'react-icons/vsc'

export const title = 'Contacts'
export const description = 'Press a letter square to open the grid, then pick a letter to jump to its group.'

const PEOPLE = ['adam', 'ana', 'ben', 'carla', 'chris', 'dina', 'emil', 'fatima', 'george', 'kim', 'lars', 'maria', 'nora', 'omar', 'sara', 'tom', 'zoe']
const GROUPS = PEOPLE.reduce<Record<string, string[]>>((all, name) => {
  ;(all[name[0]!] ??= []).push(name)
  return all
}, {})

export default function Contacts() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ height: 360, width: 360, maxWidth: '100%', overflowY: 'auto', border: '1px solid var(--mt-border)', padding: '0 16px' }}>
      {Object.entries(GROUPS).map(([letter, names]) => (
        <section key={letter} id={`contacts-group-${letter}`}>
          <JumpListHeader letter={letter} onClick={() => setOpen(true)} style={{ margin: '12px 0 4px' }} />
          {names.map((name) => (
            <p key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0' }}>
              <VscPerson /> {name}
            </p>
          ))}
        </section>
      ))}
      <JumpList open={open} onOpenChange={setOpen} groups={Object.keys(GROUPS)} listId="contacts" />
    </div>
  )
}
