import { ConfigProvider } from '@altern-digital/metro-ui'
import { Component, useState, type ReactNode } from 'react'
import type { Example as ExampleData } from '../registry'
import { href } from '../router'
import { Code } from './Code'

export type Frame = 'desktop' | 'mobile'

/** Base64 for the playground link; unicode-safe. */
export const encodeCode = (code: string) => btoa(String.fromCharCode(...new TextEncoder().encode(code)))
export const decodeCode = (b64: string) => new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)))

/**
 * A live example: the preview on top, its source below. The mobile frame is
 * a 375px box under a nested provider forced to the mobile platform and
 * touch density, so adaptive components show their phone form on a desktop.
 */
export function Example({ example, anchor }: { example: ExampleData; anchor: string }) {
  const [frame, setFrame] = useState<Frame>('desktop')
  const [showCode, setShowCode] = useState(true)
  const Demo = example.Component
  return (
    <section className="site-example" id={anchor}>
      <header className="site-example-head">
        <div>
          <h3>
            <a href={`#${anchor}`} onClick={(e) => (e.preventDefault(), document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }))}>
              {example.title}
            </a>
          </h3>
          {example.description && <p>{example.description}</p>}
        </div>
        <div className="site-example-tools" role="group" aria-label="preview">
          <FrameSwitch value={frame} onChange={setFrame} />
          <button type="button" className="site-chip" aria-pressed={showCode} onClick={() => setShowCode((v) => !v)}>
            code
          </button>
          <a className="site-chip" href={href(`/playground?code=${encodeURIComponent(encodeCode(example.code))}`)}>
            edit
          </a>
        </div>
      </header>
      <Preview frame={frame}>
        <Demo />
      </Preview>
      {showCode && <Code code={example.code} />}
    </section>
  )
}

export function FrameSwitch({ value, onChange }: { value: Frame; onChange: (f: Frame) => void }) {
  return (
    <>
      {(['desktop', 'mobile'] as const).map((f) => (
        <button key={f} type="button" className="site-chip" aria-pressed={value === f} onClick={() => onChange(f)}>
          {f}
        </button>
      ))}
    </>
  )
}

export function Preview({ frame, children }: { frame: Frame; children: ReactNode }) {
  return (
    <div className="site-preview" data-frame={frame}>
      <ErrorBoundary>
        {frame === 'mobile' ? (
          <ConfigProvider platform="mobile" density="touch" className="site-preview-phone">
            {children}
          </ConfigProvider>
        ) : (
          <div className="site-preview-desk">{children}</div>
        )}
      </ErrorBoundary>
    </div>
  )
}

export class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: unknown }, { error: Error | null; key?: unknown }> {
  override state = { error: null as Error | null, key: this.props.resetKey }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  static getDerivedStateFromProps(props: { resetKey?: unknown }, state: { key?: unknown }) {
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null
  }
  override render() {
    if (this.state.error) return <pre className="site-error">{String(this.state.error.message || this.state.error)}</pre>
    return this.props.children
  }
}
