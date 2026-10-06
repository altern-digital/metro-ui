# Contributing to metro-ui

Bun only (`bun`, `bunx`), never npm/yarn/pnpm.

```bash
bun install
bun run dev          # docs site + playground (Vite)
bun run check        # typecheck, lint, test, build, size budgets
```

## Rules of the look (Metro / Windows 8–10)

- **Square.** No `border-radius` except: AppBarButton (circle), Avatar (optional circle), status dots, and the ToggleSwitch track/thumb is square too (Windows 10 rounded them; we don't).
- **Flat.** No gradients. No drop shadows. `box-shadow` is only ever an *inset* wash (hover/press tint) or an inset line (`inset 0 -2px` focus underline).
- **Type does the work.** Segoe UI / Selawik via `--mt-font`. Big headings are weight 200, lowercase. Chrome labels (buttons, tabs, headers) are `text-transform: lowercase`; user content never is.
- **One accent.** Colour comes from tokens only: `var(--mt-accent)`, `--mt-accent-text` (accent as text on the background), `--mt-on-accent` (text on an accent fill), `--mt-text`, `--mt-muted`, `--mt-bg`, `--mt-panel`, `--mt-raised`, `--mt-border`, `--mt-edge`, `--mt-danger/warning/success/info`, `--mt-tone-<name>`. Never a hex in component CSS except `#fff`/`#000` on a fill.
- **Colour changes are instant** (no `transition` on colour/background). Movement uses `--mt-ease-enter` (arrive fast, settle) and `--mt-ease-exit` (accelerate away), or the variants in `src/motion`.
- **Sizes from tokens**: `--mt-control-h` (follows density: 28/32/44), `--mt-control-px`, `--mt-space-1..8` (4,8,12,16,20,24,32,40), `--mt-text-xs..display` (11,12,13,15,18,24,28,34,42), `--mt-border-w` (2px), `--mt-z-*`.

## A component

```
src/components/<category>/<Name>/
  <Name>.tsx         the component (named export), plus its types
  <Name>.css         its styles; picked up automatically by scripts/build-css.ts
  <Name>.test.tsx    bun test + @testing-library/react
  index.ts           export * from './<Name>'
```

and add `export * from './<Name>'` to `src/components/<category>/index.ts`.

Look at `inputs/Button` as the reference. In short:

- **React 19**: `ref` is a normal prop; no `forwardRef`. Function components, named exports.
- **Defaults**: `const { … } = useDefaults('<Name>', props)` so apps can set defaults in `ConfigProvider components={{ Name: {…} }}`.
- **Class names**: root gets `mt-<kebab-name>` merged with `className` via `cx()`. Parts are `mt-<kebab-name>-<part>`. Variants/states are **data attributes** (`data-variant`, `data-size`, `data-selected`), booleans via `flag()` from `src/utils.ts`. Spread the remaining HTML props onto the root.
- **CSS**: plain CSS, no nesting deeper than needed, no `!important`. It is wrapped in `@layer metro` by the build, so apps override without specificity fights. Private custom properties are `--_name` on the component root.
- **Press & hover**: anything pressable gets `data-mt-press=""` (instant touch tint from the global tracker) and, if it should show the hover wash, `data-mt-hover=""`. Don't write `:active` styles yourself.
- **Icons**: accept `IconSource` and render with `renderIcon()` from `foundation/Icon/Icon`. Ship no icons; draw tiny glyphs (chevron, check, ×) as inline SVG paths in the component, `width/height="1em"`, `fill`/`stroke="currentColor"`.
- **Controlled + uncontrolled**: `value`/`defaultValue`/`onChange` (or `open`/`defaultOpen`/`onOpenChange`, `checked`/…) via `useUncontrolled` from `@mantine/hooks`.
- **Hooks**: import from `@mantine/hooks` per function (`useClickOutside`, `useFocusTrap`, `useMergedRef`, `useHotkeys`, `useId`…). Don't add dependencies.
- **Motion**: use `m.*` from `motion/react` (never `motion.*`: the provider uses LazyMotion with `domAnimation`) and `AnimatePresence`; variants from `src/motion/variants.ts` with `{...presence}`. Respect `useConfig().reducedMotion`.
- **Adaptive** (`[A]` components): read `useConfig().platform` (`'mobile' | 'desktop'`) or `useAdaptive()`, and accept a prop to force a form. Mobile forms: full-width, bottom-anchored, 44px targets.
- **Overlays**: render through `<Portal>` (`foundation/Portal`) so they sit inside the provider's themed root. Z-index from `--mt-z-*`.
- **Text the component says by itself** comes from `useLocale()` (`src/config/theme.ts` `Locale`); add keys there if needed (both English and `LOCALE_ID`).
- **SSR-safe**: no `window`/`document` during render; only in effects/handlers.
- **Accessible**: right roles and `aria-*`, keyboard (Tab, Enter/Space, Escape, arrows where a list), visible `:focus-visible` (the base outline is usually enough).
- **Light**: no big tables of data, no heavy helpers. Every byte ships.

## Docs for a component

```
playground/src/docs/<category>/<Name>/
  meta.ts                 export default { … } satisfies ComponentDoc  (see playground/src/docs/types.ts)
  examples/<Example>.tsx  default export renders it; export const title / description
```

Examples are shown live *and* as their own source code, so write them as code a user would copy: import from `'@altern-digital/metro-ui'` (and icons from `'react-icons/vsc'`), inline `style` for layout only, no docs helpers. Two to five examples per component, the first one the simplest.
