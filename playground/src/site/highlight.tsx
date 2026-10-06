import type { ReactNode } from 'react'

/**
 * A tiny TSX / shell / CSS highlighter: enough colour to read a sample, no
 * grammar. One regex, tokens in order of precedence.
 */
const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|(?<=^|\n)#\s[^\n]*)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`)|(<\/?[A-Za-z][\w.]*|\/?>)|\b(import|from|export|default|function|return|const|let|var|if|else|await|async|new|type|interface|extends|true|false|null|undefined|as|of|in|for|while|satisfies)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?==)|(--[\w-]+)/g

const CLASS = ['', 'c', 's', 't', 'k', 'n', 'a', 'v'] as const

export function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const group = m.findIndex((g, n) => n > 0 && g !== undefined)
    out.push(
      <span key={i++} className={`hl-${CLASS[group]}`}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}
