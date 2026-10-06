import { Pivot } from '@altern-digital/metro-ui'

export const title = 'Basic'
export const description = 'Pick a header, use the arrow keys, or swipe the view on a touch screen.'

const view = (text: string) => <p style={{ padding: '16px 0', margin: 0 }}>{text}</p>

export default function Basic() {
  return (
    <Pivot
      items={[
        { key: 'all', label: 'all', content: view('every message in the inbox') },
        { key: 'unread', label: 'unread', content: view('the ones you have not opened') },
        { key: 'flagged', label: 'flagged', content: view('the ones you marked to come back to') },
        { key: 'urgent', label: 'urgent', content: view('nothing urgent'), disabled: true },
      ]}
    />
  )
}
