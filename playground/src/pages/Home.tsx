import { Button, LiveTile, Tile, TileGrid } from '@altern-digital/metro-ui'
import {
  VscBook,
  VscBrowser,
  VscCode,
  VscColorMode,
  VscDeviceMobile,
  VscExtensions,
  VscGithub,
  VscLayers,
  VscLayout,
  VscListFlat,
  VscPlay,
  VscSymbolColor,
  VscWand,
} from 'react-icons/vsc'
import { DOCS, byCategory } from '../registry'
import type { Category } from '../docs/types'
import { go, href } from '../router'
import { Code } from '../site/Code'
import { REPO } from '../site/Shell'

const WHY: Array<[string, string]> = [
  ['light', 'About 32 KB of JS and 12 KB of CSS (minified, brotli) for everything, and tree-shaken per component. Plain CSS in a cascade layer, no runtime styles.'],
  ['one provider', 'ConfigProvider sets mode, accent, density, platform, motion and labels. Providers nest, so one corner of the page can wear another accent.'],
  ['adaptive', 'Dialogs, menus, selects, toasts, the navigation pane and command bars change form between a phone and a desktop on their own.'],
  ['metro motion', 'motion with the Metro curves: arrive fast, then settle. Loaded lazily, and it honours reduced motion.'],
  ['touch-first', 'Instant press tint, tap-versus-scroll detection and 44px targets under a finger.'],
  ['accessible', 'Real roles, arrow keys, Home and End, Escape, typeahead, focus traps and focus return.'],
]

const count = (key: Category) => byCategory(key).length
/** Category tiles open that category's first component. */
const first = (key: Category) => () => go(`/components/${byCategory(key)[0]?.slug ?? ''}`)

/** Landing page: a hero and a Start screen whose tiles lead into the docs. */
export function Home() {
  const to = (path: string) => () => go(path)
  return (
    <div className="site-home">
      <section className="site-hero">
        <h1>metro-ui</h1>
        <p className="site-lead">
          A very light Metro UI library for React. Flat tiles, one accent, big lowercase type, and {DOCS.length} components that know whether they
          are on a phone or a desktop.
        </p>
        <div className="site-hero-actions">
          <Button variant="accent" size="lg" href={href('/docs/installation')}>
            get started
          </Button>
          <Button size="lg" href={href('/components')}>
            components
          </Button>
          <Button size="lg" variant="text" href={href('/playground')}>
            playground
          </Button>
        </div>
        <Code code="bun add @altern-digital/metro-ui motion" className="site-hero-install" />
        <p className="site-hero-note">
          Published on <a href={`${REPO}/pkgs/npm/metro-ui`}>GitHub Packages</a>: map the <code>@altern-digital</code> scope once,{' '}
          <a href={href('/docs/installation')}>see installation</a>.
        </p>
      </section>

      <section className="site-home-start" aria-label="start">
        <TileGrid
          tileSize={128}
          groups={[
            {
              title: 'start here',
              tiles: (
                <>
                  <LiveTile
                    size="wide"
                    tone="var(--mt-accent)"
                    icon={VscBook}
                    title="docs"
                    faces={[
                      <div key="a" className="site-home-face">two lines to set up: the stylesheet and a ConfigProvider</div>,
                      <div key="b" className="site-home-face">works with the Next.js App Router, no theme flash</div>,
                    ]}
                    onClick={to('/docs/introduction')}
                  />
                  <Tile tone="purple" icon={VscPlay} title="playground" onClick={to('/playground')} />
                  <Tile tone="teal" icon={VscSymbolColor} title="theme" onClick={to('/theme')} />
                  <Tile size="small" tone="slate" icon={VscGithub} aria-label="github" href={REPO} />
                  <Tile size="small" tone="green" icon={VscDeviceMobile} aria-label="mobile and desktop" onClick={to('/docs/adaptive')} />
                  <Tile size="small" tone="orange" icon={VscWand} aria-label="motion" onClick={to('/docs/motion')} />
                  <Tile size="small" tone="indigo" icon={VscColorMode} aria-label="theming" onClick={to('/docs/theming')} />
                </>
              ),
            },
            {
              title: 'components',
              tiles: (
                <>
                  <Tile size="wide" tone="blue" icon={VscLayers} title="inputs" count={count('inputs')} onClick={first('inputs')} />
                  <Tile tone="cyan" icon={VscLayout} title="layout" count={count('layout')} onClick={first('layout')} />
                  <Tile tone="amber" icon={VscListFlat} title="tiles & data" count={count('data')} onClick={first('data')} />
                  <Tile tone="red" icon={VscBrowser} title="overlays" count={count('feedback')} onClick={first('feedback')} />
                  <Tile tone="pink" icon={VscExtensions} title="display" count={count('display')} onClick={first('display')} />
                  <Tile size="wide" tone="lime" icon={VscCode} title="navigation" count={count('navigation')} onClick={first('navigation')} />
                  <Tile tone="green" icon={VscDeviceMobile} title="mobile" count={count('mobile')} onClick={first('mobile')} />
                </>
              ),
            },
          ]}
        />
      </section>

      <section className="site-home-why" aria-label="why">
        {WHY.map(([head, body]) => (
          <div key={head} className="site-home-point">
            <h2>{head}</h2>
            <p>{body}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
