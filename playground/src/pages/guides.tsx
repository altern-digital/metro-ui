import type { ReactNode } from 'react'
import { Code } from '../site/Code'
import { href } from '../router'

/** The written guides, in sidebar order. Each is plain JSX. */
export interface Guide {
  slug: string
  title: string
  lead: string
  body: () => ReactNode
}

const c = (s: string) => <code>{s}</code>

export const GUIDES: Guide[] = [
  {
    slug: 'introduction',
    title: 'introduction',
    lead: 'A very light Metro UI library for React: flat tiles, one accent, big lowercase type, and components that change form between a phone and a desktop.',
    body: () => (
      <>
        <p>
          metro-ui brings back the design language of Windows 8, Windows 10 and Windows Phone: square, flat, typographic. It is made for apps that
          want to look calm and fast on every screen, and it is small enough to use on a phone over a slow connection.
        </p>
        <h2>what you get</h2>
        <ul>
          <li>
            <strong>Around fifty components</strong>: inputs, live tiles and the Start grid, lists and tables, dialogs, menus, toasts, pivots, the
            navigation pane, and phone-only pieces like the jump list and pull-to-refresh.
          </li>
          <li>
            <strong>One provider</strong>, {c('ConfigProvider')}, sets the mode, accent, density, platform, motion and labels for everything inside it.
          </li>
          <li>
            <strong>Adaptive components</strong> (marked <span className="site-tag" data-platform="adaptive">A</span>) take the right form by
            themselves: a dialog is a band across the screen on a desktop and a sheet on a phone; the navigation pane becomes a bottom tab bar.
          </li>
          <li>
            <strong>Motion</strong> from {c('motion')} with the Metro curves (arrive fast, settle), loaded lazily, and switched off when the user asks
            for less motion.
          </li>
          <li>
            <strong>Plain CSS</strong> in a cascade layer, driven by {c('--mt-*')} custom properties. No CSS-in-JS, nothing computed at runtime, and
            your own CSS always wins.
          </li>
        </ul>
        <h2>how light</h2>
        <p>
          The whole library is about 32 KB of JavaScript and 12 KB of CSS (minified, brotli) before tree-shaking; a page that uses a few buttons and fields
          ships a few kilobytes. Its only dependencies are {c('@mantine/hooks')} (tree-shaken per hook) and, as peers, {c('react')} and {c('motion')}.
        </p>
        <p>
          Next: <a href={href('/docs/installation')}>installation</a>.
        </p>
      </>
    ),
  },
  {
    slug: 'installation',
    title: 'installation',
    lead: 'Install the package and its peers, import the stylesheet once, and wrap your app in ConfigProvider.',
    body: () => (
      <>
        <h2>1. install</h2>
        <Code code={'bun add @altern-digital/metro-ui motion'} label="bun" />
        <Code code={'npm install @altern-digital/metro-ui motion\n# or: pnpm add / yarn add'} label="npm" />
        <p>
          {c('react')} and {c('react-dom')} 19 are peers too. Icons are not bundled: use any React icon set. The examples here use{' '}
          {c('react-icons/vsc')} (the VS Code icons, which match Metro well).
        </p>
        <h2>2. the stylesheet and the provider</h2>
        <Code
          code={`import '@altern-digital/metro-ui/styles.css'
import { ConfigProvider, Button } from '@altern-digital/metro-ui'

export function App() {
  return (
    <ConfigProvider theme={{ accent: 'teal' }}>
      <Button variant="accent">hello metro</Button>
    </ConfigProvider>
  )
}`}
        />
        <p>
          That is all the setup. {c('ConfigProvider')} renders a {c('div.mt-root')} that carries the theme, so put it around the part of the page
          that uses metro-ui, usually the whole app.
        </p>
        <h2>Next.js (App Router)</h2>
        <p>
          Every component is marked {c("'use client'")}, so you can import them from server components. Import the CSS in the root layout and
          render the provider there:
        </p>
        <Code
          code={`// app/layout.tsx
import '@altern-digital/metro-ui/styles.css'
import { ConfigProvider } from '@altern-digital/metro-ui'
import { headers } from 'next/headers'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const phone = /Mobi|Android/i.test((await headers()).get('user-agent') ?? '')
  return (
    <html lang="en">
      <body>
        <ConfigProvider initialBreakpoint={phone ? 'compact' : 'expanded'}>{children}</ConfigProvider>
      </body>
    </html>
  )
}`}
        />
        <p>
          {c('initialBreakpoint')} is what the server renders before the real width is known; passing {c("'compact'")} for phones avoids a desktop
          flash. Theme colours are inline CSS variables, so they never flash.
        </p>
        <h2>Vite, Remix, anything else</h2>
        <p>Same two lines: import the stylesheet once at the entry, render the provider at the root.</p>
        <h2>from GitHub instead of npm</h2>
        <Code code={'bun add https://github.com/altern-digital/metro-ui/releases/download/v0.1.0/altern-digital-metro-ui-0.1.0.tgz'} />
        <p>Every GitHub release carries the built package as a tarball, the same file npm serves.</p>
      </>
    ),
  },
  {
    slug: 'theming',
    title: 'theming',
    lead: 'Mode, accent, tones and tokens: everything about colour and size goes through ConfigProvider.',
    body: () => (
      <>
        <Code
          code={`<ConfigProvider
  theme={{
    mode: 'dark',                         // 'dark' (default) | 'light' | 'system'
    accent: 'teal',                       // a Metro tone, a custom tone, or any colour
    tones: { brand: '#0d3b34' },          // add tones, usable by name: <Tile tone="brand">
    tokens: { '--mt-font': 'Inter, sans-serif' }, // override any token
  }}
  density="auto"                          // 'compact' | 'comfortable' | 'touch'
>`}
        />
        <h2>the accent</h2>
        <p>
          Metro has one accent colour, used for the selected thing and the one important action. Pick one of the thirteen tones ({c('blue')},{' '}
          {c('teal')}, {c('lime')}, {c('pink')}…) or pass any CSS colour. Text on the accent turns black only where white would be unreadable
          (lime, amber). Shades for hover and press are derived in CSS with {c('color-mix()')}, so changing the accent costs nothing.
        </p>
        <p>
          Try it: the <a href={href('/theme')}>theme builder</a> changes this whole site and writes the code for you.
        </p>
        <h2>nesting</h2>
        <p>Providers nest. An inner one inherits everything and overrides what it sets:</p>
        <Code
          code={`<ConfigProvider theme={{ accent: 'blue' }}>
  <App />
  <ConfigProvider theme={{ mode: 'light', accent: 'orange' }}>
    <PromoBanner />
  </ConfigProvider>
</ConfigProvider>`}
        />
        <h2>tokens</h2>
        <p>
          Every colour, size and curve is a {c('--mt-*')} custom property. Set them through {c('theme.tokens')}, or in your own CSS on{' '}
          {c('.mt-root')}:
        </p>
        <Code
          code={`.mt-root {
  --mt-font: 'Inter', system-ui, sans-serif;
  --mt-tile-size: 132px;   /* Start tile size */
  --mt-panel: #101418;     /* panels and menus */
}`}
          label="css"
        />
        <TokenTable />
        <h2>overriding component CSS</h2>
        <p>
          All metro-ui CSS lives in {c('@layer metro')}. Styles outside a layer always beat styles inside one, so your CSS (or Tailwind utilities)
          wins without {c('!important')} or specificity tricks. Classes are {c('mt-<component>')} and states are data attributes, e.g.{' '}
          {c(".mt-button[data-variant='accent']")}.
        </p>
        <h2>default props</h2>
        <Code code={`<ConfigProvider components={{ Button: { variant: 'primary' }, TextField: { clearable: true } }}>`} />
        <h2>labels</h2>
        <p>
          The words components say by themselves (ok, cancel, search, loading…) come from {c('locale')}. An Indonesian set ships as{' '}
          {c('LOCALE_ID')}:
        </p>
        <Code code={`import { ConfigProvider, LOCALE_ID } from '@altern-digital/metro-ui'\n\n<ConfigProvider locale={LOCALE_ID}>`} />
      </>
    ),
  },
  {
    slug: 'adaptive',
    title: 'mobile & desktop',
    lead: 'One component, the right form for the screen: how platform, density and breakpoints work.',
    body: () => (
      <>
        <h2>breakpoints</h2>
        <p>The Windows 10 ones: {c('compact')} below 641px, {c('medium')} below 1008px, {c('expanded')} from 1008px.</p>
        <h2>platform</h2>
        <p>
          {c('platform')} is {c("'mobile'")} or {c("'desktop'")}. With {c("platform='auto'")} (the default) it is mobile on compact screens.
          Adaptive components read it and change form:
        </p>
        <table className="site-table">
          <thead>
            <tr>
              <th>component</th>
              <th>desktop</th>
              <th>mobile</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Dialog', 'a band across the middle of the screen', 'a full-screen sheet from the bottom'],
              ['MenuFlyout / ContextMenu', 'a menu next to the trigger', 'a bottom sheet with big rows'],
              ['Select', 'a dropdown list', 'a bottom sheet list picker'],
              ['Toast', 'slides in at the bottom right', 'a banner, swipe to dismiss'],
              ['NavigationView', 'a left pane, compact on medium', 'a bottom tab bar'],
              ['CommandBar', 'a bar on top', 'the Windows Phone app bar at the bottom'],
              ['Table', 'a table', 'a stack of cards'],
            ].map(([n, d, m]) => (
              <tr key={n}>
                <td>
                  <a href={href(`/components/${n!.split(' ')[0]}`)}>{n}</a>
                </td>
                <td>{d}</td>
                <td>{m}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Force a form for a subtree, or per component:</p>
        <Code code={`<ConfigProvider platform="mobile">…</ConfigProvider>\n<Dialog platform="desktop" … />`} />
        <h2>density</h2>
        <p>
          Controls are 32px tall with a mouse and 44px under a finger. {c("density='auto'")} picks by pointer; force {c("'compact'")} (28px),{' '}
          {c("'comfortable'")} or {c("'touch'")}.
        </p>
        <h2>showing different UI</h2>
        <Code
          code={`import { Show, Adaptive, useIsMobile, useAdaptive } from '@altern-digital/metro-ui'

<Show below="medium">only on phones (CSS, safe for SSR)</Show>
<Show from="expanded">only on wide screens</Show>
<Adaptive mobile={<BottomTabBar … />} desktop={<NavigationView … />} />

const mobile = useIsMobile()
const columns = useAdaptive({ mobile: 1, desktop: 3 })`}
        />
        <p>
          {c('Show')} hides with CSS media queries, so it is right on the first server render. {c('Adaptive')} and the hooks follow the
          provider&apos;s resolved platform.
        </p>
        <h2>touch</h2>
        <p>
          Pressable things get an instant tint under a finger (no 300ms wait), a short haptic buzz where supported ({c('haptics')} on the provider),
          and taps are told apart from scrolls and flings.
        </p>
      </>
    ),
  },
  {
    slug: 'motion',
    title: 'motion',
    lead: 'Metro moves with purpose: things arrive fast and settle. The curves and variants are yours to use too.',
    body: () => (
      <>
        <p>
          Components animate with {c('motion')} through {c('LazyMotion')}, so only the DOM animation features load. Use {c('m.div')} in your own
          code inside the provider (or {c('motion.div')}, which works too but is heavier).
        </p>
        <Code
          code={`import { m, AnimatePresence } from 'motion/react'
import { drill, presence, stagger, tile, EASE_ENTER } from '@altern-digital/metro-ui/motion'

<AnimatePresence>
  {open && <m.div variants={drill} {...presence} key="panel">…</m.div>}
</AnimatePresence>

<m.ul variants={stagger} initial="initial" animate="animate">
  {items.map((i) => <m.li key={i.id} variants={tile}>{i.name}</m.li>)}
</m.ul>`}
        />
        <p>
          Variants: {c('drill')} (pages and dialogs swing in), {c('fade')}, {c('menu')}/{c('menuUp')}, {c('sheet')}, {c('drawer')}, {c('pop')},{' '}
          {c('stagger')}+{c('tile')}, {c('folding')}, {c('pivot')}, {c('bar')}, {c('rise')}, {c('slideFromRight')}, {c('dropIn')}.
        </p>
        <h2>tweening numbers</h2>
        <Code
          code={`import { useTween } from '@altern-digital/metro-ui/motion'

function Counter({ value }: { value: number }) {
  const shown = useTween(value, { duration: 800, easing: 'easeOutExpo' })
  return <span>{Math.round(shown)}</span>
}`}
        />
        <p>
          Easing names come from {c('easing-utils')} ({c('easeOutExpo')}, {c('easeInOutCubic')}, {c('easeOutBack')}…).
        </p>
        <h2>reduced motion</h2>
        <p>
          {c("motion='auto'")} follows the OS setting. {c("'reduced'")} and {c("'none'")} drop movement everywhere (opacity still changes, instantly or nearly); {c("'full'")} animates even
          when the OS asks for less.
        </p>
      </>
    ),
  },
  {
    slug: 'hooks',
    title: 'hooks',
    lead: 'The hooks the components use, plus a curated set from @mantine/hooks, from one import.',
    body: () => (
      <>
        <Code
          code={`import { useConfig, useIsMobile, useBreakpoint, useLocale, useAdaptive, useTween,
  useDisclosure, useClickOutside, useClipboard, useDebouncedValue, useHotkeys,
  useLocalStorage, useMediaQuery, useIntersection, useViewportSize } from '@altern-digital/metro-ui/hooks'`}
        />
        <table className="site-table">
          <tbody>
            {[
              ['useConfig()', 'everything the nearest provider resolved: theme, platform, breakpoint, coarse, reducedMotion, locale'],
              ['useIsMobile() / usePlatform()', 'the resolved platform'],
              ['useBreakpoint()', "'compact' | 'medium' | 'expanded'"],
              ['useAdaptive({ mobile, desktop })', 'pick a value by platform'],
              ['useTween(target, opts)', 'animate a number with an easing'],
              ['useLocale()', 'the merged labels'],
            ].map(([n, d]) => (
              <tr key={n}>
                <td>
                  <code>{n}</code>
                </td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Re-exported from {c('@mantine/hooks')}: useClickOutside, useClipboard, useDebouncedCallback, useDebouncedValue, useDisclosure,
          useDocumentTitle, useElementSize, useFocusTrap, useHotkeys, useIntersection, useInterval, useLocalStorage, useMediaQuery, useMergedRef,
          useMounted, useNetwork, useReducedMotion, useResizeObserver, useTimeout, useToggle, useUncontrolled, useViewportSize, useWindowScroll.
        </p>
      </>
    ),
  },
  {
    slug: 'imperative',
    title: 'dialogs & toasts',
    lead: 'Ask and tell from anywhere in your code: useDialog and useToast.',
    body: () => (
      <>
        <Code
          code={`import { useDialog, useToast, Button } from '@altern-digital/metro-ui'

function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const dialog = useDialog()
  const toast = useToast()
  return (
    <Button
      variant="danger"
      onClick={async () => {
        const ok = await dialog.confirm({ title: 'delete this file?', content: 'It cannot be undone.', danger: true })
        if (!ok) return
        await onDelete()
        toast.success({ title: 'deleted' })
      }}
    >
      delete
    </Button>
  )
}`}
        />
        <p>
          Both mount into the provider&apos;s own overlay layer the first time they are used, so they wear its theme and cost nothing until then.
          See <a href={href('/components/Dialog')}>Dialog</a> and <a href={href('/components/Toast')}>Toast</a>.
        </p>
      </>
    ),
  },
]

function TokenTable() {
  const rows: [string, string][] = [
    ['--mt-accent / --mt-on-accent', 'the accent and the text on it'],
    ['--mt-bg / --mt-panel / --mt-raised', 'page, panels, raised surfaces'],
    ['--mt-text / --mt-muted', 'text and secondary text'],
    ['--mt-border / --mt-edge', 'hairlines and control outlines'],
    ['--mt-danger / --mt-warning / --mt-success / --mt-info', 'status colours'],
    ['--mt-tone-<name>', 'the 13 Metro tones and yours'],
    ['--mt-font / --mt-mono', 'typefaces'],
    ['--mt-text-xs … --mt-text-display', '11, 12, 13, 15, 18, 24, 28, 34, 42px'],
    ['--mt-space-1 … --mt-space-8', '4, 8, 12, 16, 20, 24, 32, 40px'],
    ['--mt-control-h / --mt-control-px', 'control height (follows density) and padding'],
    ['--mt-tile-size / --mt-tile-gap', 'Start tile size and gap'],
    ['--mt-ease-enter / --mt-ease-exit', 'the Metro curves'],
  ]
  return (
    <table className="site-table">
      <tbody>
        {rows.map(([t, d]) => (
          <tr key={t}>
            <td>
              <code>{t}</code>
            </td>
            <td>{d}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
