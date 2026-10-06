# metro-ui

A very light **Metro** (Windows 8 / 10 / Windows Phone) UI library for React. Flat tiles, one accent, big lowercase type, and components that take the right form on a phone or a desktop.

**[Docs, live examples and playground →](https://altern-digital.github.io/metro-ui/)**

The package is published to **GitHub Packages**, not npm. Point the `@altern-digital` scope at GitHub once per project, then install as usual:

```toml
# bunfig.toml
[install.scopes]
"@altern-digital" = { token = "$GITHUB_TOKEN", url = "https://npm.pkg.github.com/" }
```

```bash
bun add @altern-digital/metro-ui motion
```

GitHub asks for a token even for public packages: a [classic personal access token](https://github.com/settings/tokens/new?scopes=read:packages) with `read:packages`, exported as `GITHUB_TOKEN` (in GitHub Actions, the job's own `GITHUB_TOKEN` with `packages: read` works). npm, pnpm and yarn use `.npmrc` instead, and no token at all is needed to install a release tarball; see [installation](https://altern-digital.github.io/metro-ui/#/docs/installation).

```tsx
import '@altern-digital/metro-ui/styles.css'
import { ConfigProvider, Button, TileGrid, Tile } from '@altern-digital/metro-ui'

export function App() {
  return (
    <ConfigProvider theme={{ mode: 'dark', accent: 'teal' }}>
      <TileGrid>
        <Tile size="wide" tone="blue" title="mail" count={3} />
        <Tile tone="green" title="store" />
      </TileGrid>
      <Button variant="accent">hello metro</Button>
    </ConfigProvider>
  )
}
```

## Why

- **Light.** About 32 KB of JS and 12 KB of CSS (minified, brotli) for *everything*; tree-shaken per component. Plain CSS in `@layer metro` driven by `--mt-*` custom properties: no CSS-in-JS, nothing computed at runtime.
- **One provider.** `ConfigProvider` sets mode (dark / light / system), accent (13 Metro tones or any colour), density, platform, motion and labels. Providers nest.
- **Adaptive.** Dialogs, menus, selects, toasts, the navigation pane, command bars and tables change form between mobile and desktop by themselves. Phone-only pieces (bottom sheet, tab bar, jump list, swipe rows, pull-to-refresh) and desktop-only ones (tooltip, split view, breadcrumb, table) are marked as such.
- **Metro motion.** [`motion`](https://motion.dev) with the Metro curves (arrive fast, settle), loaded lazily; `easing-utils` for tweened numbers; honours reduced motion.
- **Touch-first.** Instant press tint, haptics, tap-vs-scroll detection, 44px targets under a finger.
- **Accessible.** Real roles, keyboard support (arrows, Home/End, Escape, typeahead), focus traps and focus return.
- **SSR-safe.** Works with the Next.js App Router; theme colours are inline CSS variables, so nothing flashes.

## Components

| | |
|---|---|
| foundation | ConfigProvider, Pressable, Portal, Icon, Show / Adaptive, VisuallyHidden |
| inputs | Button, IconButton, AppBarButton, TextField, PasswordBox, SearchBox, Checkbox, Radio / RadioGroup, ToggleSwitch, Slider, Segmented, Select, Picker / DatePicker / TimePicker |
| layout | Title, Text, Page, Section, Stack, Grid, Fold / Expander, SplitView, Divider |
| display | Tag, Badge, Avatar, ProgressBar, ProgressRing, EmptyState, PageStates |
| tiles & data | Tile, LiveTile, TileGrid, ListView / ListItem, Table, StatTile, BarChart |
| overlays & feedback | Dialog + useDialog, Popover / Flyout, MenuFlyout, ContextMenu, Tooltip, Toast + useToast, InfoBar, BottomSheet |
| navigation | Pivot, Hub, NavigationView, CommandBar, Breadcrumb, Pagination |
| mobile | BottomTabBar, JumpList, SwipeItem, PullToRefresh |

Entry points: `@altern-digital/metro-ui` (components), `/motion` (curves, variants, `useTween`), `/hooks` (library hooks + a curated set of `@mantine/hooks`), `/styles.css`.

## Theming

```tsx
<ConfigProvider
  theme={{
    mode: 'light',                       // 'dark' (default) | 'light' | 'system'
    accent: '#ff6600',                   // or 'blue' | 'teal' | 'lime' | …
    tones: { brand: '#0d3b34' },         // usable by name: <Tile tone="brand">
    tokens: { '--mt-font': 'Inter, sans-serif' },
  }}
  density="auto"                         // 'compact' | 'comfortable' | 'touch'
  platform="auto"                        // 'mobile' | 'desktop'
  motion="auto"                          // 'full' | 'reduced' | 'none'
  locale={LOCALE_ID}                     // built-in labels; English by default
  components={{ Button: { variant: 'primary' } }}   // default props
>
```

Your own CSS always wins over the library's (it lives in a cascade layer), so `.mt-button { … }` or Tailwind classes override without `!important`.

## Develop

Bun only.

```bash
bun install
bun run dev        # docs site + playground at http://localhost:5199
bun run check      # typecheck, lint, test, build, size budgets
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the conventions every component follows.

## License

MIT
