import { useState } from 'react'
import type { PlatformTag } from '../docs/types'
import { CATEGORIES, DOCS, byCategory, type DocEntry } from '../registry'
import { href } from '../router'
import { ErrorBoundary } from '../site/Example'

const PLATFORM_LABEL: Record<PlatformTag, string> = { all: 'everywhere', adaptive: 'adaptive', mobile: 'mobile', desktop: 'desktop' }

/** The gallery: every component with its first example running live. */
export function Components() {
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState<PlatformTag | 'any'>('any')
  const q = query.trim().toLowerCase()
  const match = (d: DocEntry) =>
    (platform === 'any' || d.platform === platform) &&
    (!q || d.name.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q) || d.related?.some((r) => r.toLowerCase().includes(q)))
  const shown = DOCS.filter(match).length

  return (
    <div className="site-gallery">
      <h1 className="site-h1">components</h1>
      <p className="site-lead">
        {DOCS.length} components, each with live examples, the code to copy, and every prop. Marked{' '}
        <span className="site-tag" data-platform="adaptive">A</span> they adapt to the screen,{' '}
        <span className="site-tag" data-platform="mobile">M</span> made for phones,{' '}
        <span className="site-tag" data-platform="desktop">W</span> made for wide screens.
      </p>
      <div className="site-filter">
        <input
          type="search"
          className="site-search"
          placeholder="search components"
          aria-label="search components"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="site-chips" role="group" aria-label="platform">
          {(['any', 'all', 'adaptive', 'mobile', 'desktop'] as const).map((p) => (
            <button key={p} type="button" className="site-chip" aria-pressed={platform === p} onClick={() => setPlatform(p)}>
              {p === 'any' ? 'all' : PLATFORM_LABEL[p]}
            </button>
          ))}
        </div>
      </div>
      {shown === 0 && <p className="site-muted">Nothing matches “{query}”.</p>}
      {CATEGORIES.map((c) => {
        const items = byCategory(c.key).filter(match)
        if (items.length === 0) return null
        return (
          <section key={c.key} className="site-gallery-group">
            <h2>{c.label}</h2>
            <p className="site-muted">{c.blurb}</p>
            <div className="site-cards">
              {items.map((d) => (
                <Card key={d.slug} doc={d} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function Card({ doc }: { doc: DocEntry }) {
  const Demo = doc.demos[0]?.Component
  return (
    <a className="site-card" href={href(`/components/${doc.slug}`)}>
      <div className="site-card-demo" inert>
        <ErrorBoundary>{Demo ? <Demo /> : null}</ErrorBoundary>
      </div>
      <div className="site-card-text">
        <h3>
          {doc.name}
          {doc.platform !== 'all' && (
            <span className="site-tag" data-platform={doc.platform}>
              {PLATFORM_LABEL[doc.platform]}
            </span>
          )}
        </h3>
        <p>{doc.summary}</p>
      </div>
    </a>
  )
}
