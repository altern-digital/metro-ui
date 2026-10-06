import { ListItem, ListView } from '@altern-digital/metro-ui'

export const title = 'Letter groups'
export const description = 'The People hub: contacts under letter tiles. Each header has an id a jump list can scroll to.'

const people = ['Adi Nugroho', 'Alya Putri', 'Bayu Santoso', 'Bella Hart', 'Chen Wei', 'Dewi Lestari', 'Dimas Pratama'].map((name) => ({ id: name, name }))

export default function Groups() {
  return (
    <ListView
      id="people"
      style={{ maxWidth: 420 }}
      items={people}
      groupBy={(p) => p.name[0]!.toLowerCase()}
      renderItem={(p) => <ListItem title={p.name} subtitle="mobile" onClick={() => {}} />}
    />
  )
}
