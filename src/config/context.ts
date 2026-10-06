import { createContext, useContext } from 'react'
import type { Breakpoint } from './breakpoints'
import { DEFAULT_LOCALE, type Density, type Locale, type MotionSetting, type Platform, type ThemeConfig } from './theme'

/** Default props per component, set once on ConfigProvider (`components={{ Button: { variant: 'accent' } }}`). */
export type ComponentDefaults = Record<string, Record<string, unknown> | undefined>

export interface MetroConfig {
  theme: Required<Pick<ThemeConfig, 'mode'>> & ThemeConfig
  density: Density
  /** Resolved: what the components should look like here. */
  platform: Platform
  breakpoint: Breakpoint
  /** A finger, not a mouse: no hover, bigger targets, menus as sheets. */
  coarse: boolean
  motion: MotionSetting
  /** Whether animations should be skipped (setting or OS preference). */
  reducedMotion: boolean
  locale: Locale
  components: ComponentDefaults
  haptics: boolean
  /** Where overlays render, inside the root so they wear its theme. */
  portal: HTMLElement | null
  nested: boolean
}

export const DEFAULT_CONFIG: MetroConfig = {
  theme: { mode: 'dark' },
  density: 'auto',
  platform: 'desktop',
  breakpoint: 'expanded',
  coarse: false,
  motion: 'auto',
  reducedMotion: false,
  locale: DEFAULT_LOCALE,
  components: {},
  haptics: true,
  portal: null,
  nested: false,
}

export const ConfigContext = createContext<MetroConfig | null>(null)

/** Everything the nearest ConfigProvider resolved. Works without one, with the defaults. */
export function useConfig(): MetroConfig {
  return useContext(ConfigContext) ?? DEFAULT_CONFIG
}

export const usePlatform = (): Platform => useConfig().platform
export const useBreakpoint = (): Breakpoint => useConfig().breakpoint
export const useLocale = (): Locale => useConfig().locale
export const useIsMobile = (): boolean => useConfig().platform === 'mobile'

/**
 * A component's props with its ConfigProvider defaults underneath. Props
 * given explicitly win; `undefined` counts as not given.
 */
export function useDefaults<P extends object>(name: string, props: P): P {
  const defaults = useConfig().components[name]
  if (!defaults) return props
  const merged = { ...defaults } as Record<string, unknown>
  for (const [key, value] of Object.entries(props)) if (value !== undefined) merged[key] = value
  return merged as P
}
