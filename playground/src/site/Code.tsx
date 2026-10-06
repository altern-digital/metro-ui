import { Button } from '@altern-digital/metro-ui'
import { useClipboard } from '@mantine/hooks'
import { highlight } from './highlight'

/** A code sample with a copy button. */
export function Code({ code, label, className }: { code: string; label?: string; className?: string }) {
  const clipboard = useClipboard({ timeout: 1400 })
  return (
    <div className={`site-code ${className ?? ''}`}>
      {label && <div className="site-code-label">{label}</div>}
      <Button
        className="site-code-copy"
        size="sm"
        variant="text"
        onClick={() => clipboard.copy(code)}
        aria-label="copy code"
      >
        {clipboard.copied ? 'copied' : 'copy'}
      </Button>
      <pre>
        <code>{highlight(code)}</code>
      </pre>
    </div>
  )
}

/** Inline `code` inside prose: backticks in doc strings become <code>. */
export function Prose({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i}>
          {para.split(/(`[^`]+`)/).map((part, j) => (part.startsWith('`') ? <code key={j}>{part.slice(1, -1)}</code> : part))}
        </p>
      ))}
    </>
  )
}
