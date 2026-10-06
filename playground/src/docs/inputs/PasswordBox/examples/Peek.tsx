import { PasswordBox } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Peek, with validation'
export const description = 'Hold the eye to see the password, as on Windows 8.'

export default function Peek() {
  const [password, setPassword] = useState('')
  const short = password !== '' && password.length < 8
  return (
    <div style={{ maxWidth: 320 }}>
      <PasswordBox
        label="New password"
        revealMode="peek"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        error={short ? 'At least 8 characters.' : undefined}
      />
    </div>
  )
}
