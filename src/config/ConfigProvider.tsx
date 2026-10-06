import { useMediaQuery, useReducedMotion } from '@mantine/hooks'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { useContext, useEffect, useMemo, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { installPressTracking } from '../hooks/press'
import { cx } from '../utils'
import { MEDIA, type Breakpoint } from './breakpoints'
import { readableOn } from './color'
import { ConfigContext, DEFAULT_CONFIG, type ComponentDefaults, type MetroConfig } from './context'
import { LayersContext, type Layers } from './layers'
import { TONES, toneVar, type Density, type Locale, type MotionSetting, type PlatformSetting, type ThemeConfig } from './theme'

export interface ConfigProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Mode, accent, extra tones and token overrides. */
  theme?: ThemeConfig
  /** Control height. `auto` (default) is comfortable with a mouse and touch-sized under a finger. */
  density?: Density
  /** Force the mobile or desktop form of adaptive components. `auto` (default): mobile under 641px. */
  platform?: PlatformSetting
  /** `auto` (default) follows the OS reduced-motion setting. */
  motion?: MotionSetting
  /** Labels components show by themselves. Merged over English (or `LOCALE_ID`). */
  locale?: Partial<Locale>
  /** Default props per component, e.g. `{ Button: { variant: 'accent' } }`. */
  components?: ComponentDefaults
  /** A short buzz on touch press, where the device supports it. Default true. */
  haptics?: boolean
  /**
   * The breakpoint to render on the server and on the first client render,
   * before the real width is known. Default `expanded`; pass `compact` when
   * the request comes from a phone to avoid a desktop flash.
   */
  initialBreakpoint?: Breakpoint
  children?: ReactNode
}

/**
 * The root of a Metro UI. Renders a `div.mt-root` that carries the theme as
 * CSS variables, so it renders on the server without a flash and can be
 * nested to give a part of the page another accent or mode. Inside, overlays
 * portal into the same root and wear its theme.
 */
export function ConfigProvider({
  theme,
  density,
  platform,
  motion,
  locale,
  components,
  haptics,
  initialBreakpoint,
  className,
  style,
  children,
  ...rest
}: ConfigProviderProps) {
  const parent = useContext(ConfigContext)
  const base = parent ?? DEFAULT_CONFIG

  const compact = useMediaQuery(MEDIA.compact, initialBreakpoint === 'compact', { getInitialValueInEffect: true })
  const expanded = useMediaQuery(MEDIA.expanded, (initialBreakpoint ?? 'expanded') === 'expanded', { getInitialValueInEffect: true })
  const coarse = useMediaQuery(MEDIA.coarse, false, { getInitialValueInEffect: true })
  const osReduced = useReducedMotion(false, { getInitialValueInEffect: true })
  const breakpoint: Breakpoint = compact ? 'compact' : expanded ? 'expanded' : 'medium'

  const [portal, setPortal] = useState<HTMLElement | null>(null)
  const [layers, setLayers] = useState<Record<string, ReactNode>>({})

  const mergedTheme = useMemo(
    () => ({
      ...base.theme,
      ...theme,
      mode: theme?.mode ?? base.theme.mode,
      tones: { ...base.theme.tones, ...theme?.tones },
      tokens: { ...base.theme.tokens, ...theme?.tokens },
    }),
    [base.theme, theme],
  )

  const motionSetting = motion ?? base.motion
  const reducedMotion = motionSetting === 'none' || motionSetting === 'reduced' || (motionSetting === 'auto' && osReduced)
  const platformSetting = platform ?? (parent ? undefined : 'auto')
  const resolvedPlatform = platformSetting === 'mobile' || platformSetting === 'desktop' ? platformSetting : platformSetting === 'auto' ? (breakpoint === 'compact' ? 'mobile' : 'desktop') : base.platform

  const config = useMemo<MetroConfig>(
    () => ({
      theme: mergedTheme,
      density: density ?? base.density,
      platform: resolvedPlatform,
      breakpoint,
      coarse,
      motion: motionSetting,
      reducedMotion,
      locale: locale ? { ...base.locale, ...locale } : base.locale,
      components: components ? { ...base.components, ...components } : base.components,
      haptics: haptics ?? base.haptics,
      portal,
      nested: !!parent,
    }),
    [mergedTheme, density, base, resolvedPlatform, breakpoint, coarse, motionSetting, reducedMotion, locale, components, haptics, portal, parent],
  )

  useEffect(() => installPressTracking(config.haptics), [config.haptics])

  const layerApi = useMemo<Layers>(
    () => ({
      set: (key, node) => setLayers((all) => ({ ...all, [key]: node })),
      remove: (key) =>
        setLayers((all) => {
          if (!(key in all)) return all
          const { [key]: _, ...others } = all
          return others
        }),
    }),
    [],
  )

  const vars = useMemo(() => themeVars(mergedTheme), [mergedTheme])

  return (
    <ConfigContext.Provider value={config}>
      <LayersContext.Provider value={layerApi}>
        {/* Not `strict`: the app may use `motion.*` itself; the library only uses `m.*`. */}
        <LazyMotion features={domAnimation}>
          <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>
            <div
              {...rest}
              className={cx('mt-root', className)}
              style={{ ...vars, ...style }}
              data-mt-mode={mergedTheme.mode}
              data-mt-density={config.density}
              data-mt-motion={motionSetting}
              data-mt-platform={resolvedPlatform}
              data-mt-nested={parent ? '' : undefined}
            >
              {children}
              <div className="mt-portal" ref={setPortal} />
            </div>
            {portal && Object.keys(layers).length > 0 && createPortal(Object.values(layers), portal)}
          </MotionConfig>
        </LazyMotion>
      </LayersContext.Provider>
    </ConfigContext.Provider>
  )
}

/** The theme as inline custom properties. Only what differs from tokens.css is written. */
export function themeVars(theme: ThemeConfig): CSSProperties {
  const vars: Record<string, string | number> = {}
  for (const [name, color] of Object.entries(theme.tones ?? {})) vars[`--mt-tone-${name}`] = color
  if (theme.accent) {
    vars['--mt-accent'] = toneVar(theme.accent)!
    const hex = theme.tones?.[theme.accent] ?? (TONES as Record<string, string>)[theme.accent] ?? theme.accent
    vars['--mt-on-accent'] = readableOn(hex)
  }
  Object.assign(vars, theme.tokens)
  return vars as CSSProperties
}
