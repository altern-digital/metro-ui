import { CATEGORIES, byCategory } from '../registry'
import { href } from '../router'
import { ErrorBoundary } from '../site/Example'

/** Components that read well in a small card. Full-page ones (Page, NavigationView, SplitView, Hub…) are left to their own docs. */
const PICKS = new Set([
  'Button', 'IconButton', 'AppBarButton', 'TextField', 'PasswordBox', 'SearchBox', 'Checkbox', 'Radio', 'ToggleSwitch', 'Slider', 'Segmented', 'Select',
  'Title', 'Fold', 'Divider',
  'Tag', 'Badge', 'Avatar', 'ProgressBar', 'ProgressRing', 'EmptyState',
  'Tile', 'LiveTile', 'ListView', 'Table', 'StatTile', 'BarChart',
  'Dialog', 'Popover', 'MenuFlyout', 'Tooltip', 'useToast', 'InfoBar',
  'Pivot', 'Breadcrumb', 'Pagination',
])

/** A bit of everything, to judge a theme by: the first example of each pick, grouped by category. */
export function Sampler() {
  return (
    <div className="site-sampler">
      <h2 className="site-sampler-title">sampler</h2>
      {CATEGORIES.map((c) => {
        const docs = byCategory(c.key).filter((d) => PICKS.has(d.name) && d.demos.length > 0)
        if (!docs.length) return null
        return (
          <section key={c.key} className="site-sampler-group">
            <h3>{c.label}</h3>
            <div className="site-sampler-grid">
              {docs.map((d) => {
                const Demo = d.demos[0]!.Component
                return (
                  <div key={d.slug} className="site-sampler-card">
                    <a className="site-sampler-name" href={href(`/components/${d.slug}`)}>
                      {d.name}
                    </a>
                    <ErrorBoundary resetKey={d.slug}>
                      <Demo />
                    </ErrorBoundary>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
