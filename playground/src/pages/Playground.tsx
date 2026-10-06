import { useDebouncedValue } from '@mantine/hooks'
import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { decodeCode, encodeCode, ErrorBoundary, FrameSwitch, Preview, type Frame } from '../site/Example'
import { highlight } from '../site/highlight'

const STARTER = `import { useState } from 'react'
import { Button, ConfigProvider } from '@altern-digital/metro-ui'
import { VscAdd } from 'react-icons/vsc'

export default function App() {
  const [count, setCount] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button variant="accent" icon={VscAdd} onClick={() => setCount((c) => c + 1)}>
        add one
      </Button>
      <span style={{ fontSize: 42, fontWeight: 200 }}>{count}</span>
    </div>
  )
}`

/**
 * Modules a playground snippet can import. Loaded on demand, so the rest of
 * the site doesn't carry the compiler and the icon set.
 */
async function loadRuntime() {
  const [sucrase, react, jsx, dom, lib, libMotion, libHooks, motion, vsc, hooks] = await Promise.all([
    import('sucrase'),
    import('react'),
    import('react/jsx-runtime'),
    import('react-dom'),
    import('@altern-digital/metro-ui'),
    import('@altern-digital/metro-ui/motion'),
    import('@altern-digital/metro-ui/hooks'),
    import('motion/react'),
    import('react-icons/vsc'),
    import('@mantine/hooks'),
  ])
  const modules: Record<string, unknown> = {
    react,
    'react/jsx-runtime': jsx,
    'react-dom': dom,
    '@altern-digital/metro-ui': lib,
    '@altern-digital/metro-ui/motion': libMotion,
    '@altern-digital/metro-ui/hooks': libHooks,
    'motion/react': motion,
    'react-icons/vsc': vsc,
    '@mantine/hooks': hooks,
  }
  return (code: string): ComponentType => {
    const js = sucrase.transform(code.replace(/^import ['"][^'"]+\.css['"];?$/gm, ''), {
      transforms: ['typescript', 'jsx', 'imports'],
      jsxRuntime: 'automatic',
      production: true,
    }).code
    const require = (name: string) => {
      if (name in modules) return modules[name]
      throw new Error(`The playground can't import "${name}". Available: ${Object.keys(modules).join(', ')}`)
    }
    const exports: { default?: ComponentType } = {}
    new Function('require', 'exports', 'module', js)(require, exports, { exports })
    if (typeof exports.default !== 'function') throw new Error('Export a component as default: `export default function App() { … }`')
    return exports.default
  }
}

type Compile = Awaited<ReturnType<typeof loadRuntime>>

function initialCode(): string {
  const m = window.location.hash.match(/[?&]code=([^&]+)/)
  if (m) {
    try {
      return decodeCode(decodeURIComponent(m[1]!))
    } catch {
      /* a broken link: start fresh */
    }
  }
  try {
    return localStorage.getItem('metro-ui-playground') ?? STARTER
  } catch {
    return STARTER
  }
}

export function Playground() {
  const [code, setCode] = useState(initialCode)
  const [debounced] = useDebouncedValue(code, 300)
  const [compile, setCompile] = useState<Compile | null>(null)
  const [frame, setFrame] = useState<Frame>('desktop')
  const [copied, setCopied] = useState(false)
  const pre = useRef<HTMLPreElement>(null)

  useEffect(() => {
    let live = true
    loadRuntime().then((c) => live && setCompile(() => c))
    return () => void (live = false)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('metro-ui-playground', debounced)
    } catch {
      /* private mode */
    }
  }, [debounced])

  const result = useMemo((): { App?: ComponentType; error?: string } => {
    if (!compile) return {}
    try {
      return { App: compile(debounced) }
    } catch (e) {
      return { error: (e as Error).message }
    }
  }, [compile, debounced])

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/playground?code=${encodeURIComponent(encodeCode(code))}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      window.location.hash = url.slice(url.indexOf('#'))
    }
  }

  return (
    <div className="site-playground">
      <header className="site-playground-head">
        <h1 className="site-h1">playground</h1>
        <div className="site-chips">
          <FrameSwitch value={frame} onChange={setFrame} />
          <button type="button" className="site-chip" onClick={() => setCode(STARTER)}>
            reset
          </button>
          <button type="button" className="site-chip" onClick={share}>
            {copied ? 'link copied' : 'share link'}
          </button>
        </div>
      </header>
      <p className="site-muted site-playground-hint">
        Edit the code; the preview updates as you type. Import from <code>@altern-digital/metro-ui</code>, <code>react</code>,{' '}
        <code>motion/react</code>, <code>react-icons/vsc</code> and <code>@mantine/hooks</code>.
      </p>
      <div className="site-playground-grid">
        <div className="site-editor">
          <pre ref={pre} aria-hidden>
            <code>{highlight(code)}{'\n'}</code>
          </pre>
          <textarea
            value={code}
            spellCheck={false}
            aria-label="code"
            autoCapitalize="off"
            autoComplete="off"
            onChange={(e) => setCode(e.target.value)}
            onScroll={(e) => {
              if (pre.current) {
                pre.current.scrollTop = e.currentTarget.scrollTop
                pre.current.scrollLeft = e.currentTarget.scrollLeft
              }
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Tab' || e.shiftKey) return
              e.preventDefault()
              const t = e.currentTarget
              const { selectionStart: s, selectionEnd: end } = t
              const next = `${code.slice(0, s)}  ${code.slice(end)}`
              setCode(next)
              requestAnimationFrame(() => t.setSelectionRange(s + 2, s + 2))
            }}
          />
        </div>
        <div className="site-playground-out">
          {!compile && <p className="site-muted">loading the compiler…</p>}
          {result.error && <pre className="site-error">{result.error}</pre>}
          {result.App && (
            <Preview frame={frame}>
              <ErrorBoundary resetKey={result.App}>
                <result.App />
              </ErrorBoundary>
            </Preview>
          )}
        </div>
      </div>
    </div>
  )
}
