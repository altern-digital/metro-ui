import { Button, ContextMenu } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Turning it off'
export const description = 'With `disabled` the browser menu shows instead, for example while text is being edited.'

export default function Disabled() {
  const [disabled, setDisabled] = useState(false)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <ContextMenu disabled={disabled} items={[{ key: 'pin', label: 'pin to start' }, { key: 'unpin', label: 'unpin' }]}>
        <div tabIndex={0} style={{ display: 'grid', placeItems: 'center', width: 200, height: 80, border: '2px dashed currentColor' }}>
          {disabled ? 'browser menu' : 'metro menu'}
        </div>
      </ContextMenu>
      <Button onClick={() => setDisabled((d) => !d)}>{disabled ? 'enable' : 'disable'}</Button>
    </div>
  )
}
