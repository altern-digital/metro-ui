import { TextField } from '@altern-digital/metro-ui'
import { useState } from 'react'

export const title = 'Controlled with validation'

export default function Controlled() {
  const [code, setCode] = useState('')
  const invalid = code !== '' && !/^\d{6}$/.test(code)
  return (
    <div style={{ maxWidth: 320 }}>
      <TextField
        label="Verification code"
        value={code}
        onChange={(value) => setCode(value.replace(/\s/g, ''))}
        error={invalid ? 'Six digits.' : undefined}
        description={`${code.length}/6`}
        inputMode="numeric"
        clearable
      />
    </div>
  )
}
