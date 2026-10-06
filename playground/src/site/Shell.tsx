import { useEffect, useState, type ReactNode } from 'react'
import { CATEGORIES, byCategory } from '../registry'
import { href, useRoute } from '../router'
import { GUIDES } from '../pages/guides'
import { ThemePanel } from './ThemePanel'

export const REPO = 'https://github.com/altern-digital/metro-ui'

const TOP = [
  { path: '/docs', label: 'docs' },
  { path: '/components', label: 'components' },
  { path: '/playground', label: 'playground' },
  { path: '/theme', label: 'theme' },
]

/** Top bar, side index (docs and components), and the theme drawer. */
export function Shell({ children }: { children: ReactNode }) {
  const route = useRoute()
  const [menu, setMenu] = useState(false)
  const [theme, setTheme] = useState(false)
  const section = route[0] ?? ''
  const withSide = section === 'docs' || section === 'components'

  useEffect(() => {
    setMenu(false)
    window.scrollTo({ top: 0 })
  }, [route.join('/')])

  return (
    <div className="site" data-side={withSide || undefined}>
      <header className="site-top">
        {withSide && (
          <button type="button" className="site-icon-btn site-menu-btn" aria-label="menu" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
            <svg viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" aria-hidden>
              <path d="M1 3h14v1.5H1zM1 7.25h14v1.5H1zM1 11.5h14V13H1z" />
            </svg>
          </button>
        )}
        <a className="site-logo" href={href('/')}>
          <span className="site-logo-mark" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </span>
          metro-ui
        </a>
        <nav className="site-nav" aria-label="site">
          {TOP.map((t) => (
            <a key={t.path} href={href(t.path)} aria-current={`/${section}` === t.path ? 'page' : undefined}>
              {t.label}
            </a>
          ))}
        </nav>
        <div className="site-top-end">
          <button type="button" className="site-icon-btn" aria-label="theme" aria-expanded={theme} onClick={() => setTheme((v) => !v)}>
            <svg viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" aria-hidden>
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1.5v11a5.5 5.5 0 0 1 0-11Z" />
            </svg>
          </button>
          <a className="site-icon-btn" href={REPO} aria-label="github" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
        </div>
      </header>

      {theme && (
        <aside className="site-drawer" aria-label="theme">
          <div className="site-drawer-head">
            <h2>theme</h2>
            <button type="button" className="site-icon-btn" aria-label="close" onClick={() => setTheme(false)}>
              ×
            </button>
          </div>
          <ThemePanel />
        </aside>
      )}

      <div className="site-body">
        {withSide && (
          <aside className="site-side" data-open={menu || undefined} aria-label="index">
            <SideIndex current={route} />
          </aside>
        )}
        <main className="site-main">{children}</main>
      </div>
    </div>
  )
}

function SideIndex({ current }: { current: string[] }) {
  const here = current.join('/')
  return (
    <nav>
      <h4>get started</h4>
      {GUIDES.map((g) => (
        <a key={g.slug} href={href(`/docs/${g.slug}`)} aria-current={here === `docs/${g.slug}` || (here === 'docs' && g === GUIDES[0]) ? 'page' : undefined}>
          {g.title}
        </a>
      ))}
      <h4>
        <a href={href('/components')}>components</a>
      </h4>
      {CATEGORIES.map((c) => {
        const items = byCategory(c.key)
        if (items.length === 0) return null
        return (
          <div key={c.key} className="site-side-group">
            <h5>{c.label}</h5>
            {items.map((d) => (
              <a key={d.slug} href={href(`/components/${d.slug}`)} aria-current={here.toLowerCase() === `components/${d.slug.toLowerCase()}` ? 'page' : undefined}>
                {d.name}
                {d.platform !== 'all' && <small data-platform={d.platform}>{d.platform === 'adaptive' ? 'A' : d.platform === 'mobile' ? 'M' : 'W'}</small>}
              </a>
            ))}
          </div>
        )
      })}
    </nav>
  )
}
