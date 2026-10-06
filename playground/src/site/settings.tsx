import type { Density, MotionSetting, PlatformSetting, ThemeMode } from '@altern-digital/metro-ui'
import { useLocalStorage } from '@mantine/hooks'
import { createContext, useContext, type ReactNode } from 'react'

/** What the theme panel controls; the whole site renders inside it. */
export interface SiteSettings {
  mode: ThemeMode
  accent: string
  density: Density
  platform: PlatformSetting
  motion: MotionSetting
  locale: 'en' | 'id'
}

export const DEFAULT_SETTINGS: SiteSettings = {
  mode: 'dark',
  accent: 'blue',
  density: 'auto',
  platform: 'auto',
  motion: 'auto',
  locale: 'en',
}

type Ctx = [SiteSettings, (patch: Partial<SiteSettings>) => void, () => void]
const SettingsContext = createContext<Ctx | null>(null)

export function SettingsProvider({ children }: { children: (s: SiteSettings) => ReactNode }) {
  const [stored, setStored] = useLocalStorage<SiteSettings>({ key: 'metro-ui-docs', defaultValue: DEFAULT_SETTINGS })
  const settings = { ...DEFAULT_SETTINGS, ...stored }
  const value: Ctx = [settings, (patch) => setStored((s) => ({ ...DEFAULT_SETTINGS, ...s, ...patch })), () => setStored(DEFAULT_SETTINGS)]
  return <SettingsContext value={value}>{children(settings)}</SettingsContext>
}

export function useSettings(): Ctx {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings outside SettingsProvider')
  return ctx
}
