import { TONES } from '@altern-digital/metro-ui'
import { useSettings, type SiteSettings } from './settings'

type Choice<K extends keyof SiteSettings> = { key: K; label: string; options: SiteSettings[K][] }

const CHOICES = [
  { key: 'mode', label: 'mode', options: ['dark', 'light', 'system'] },
  { key: 'density', label: 'density', options: ['auto', 'compact', 'comfortable', 'touch'] },
  { key: 'platform', label: 'platform', options: ['auto', 'desktop', 'mobile'] },
  { key: 'motion', label: 'motion', options: ['auto', 'full', 'reduced', 'none'] },
  { key: 'locale', label: 'locale', options: ['en', 'id'] },
] satisfies Choice<keyof SiteSettings>[]

/** The site-wide theme: every page and example renders under these settings. */
export function ThemePanel() {
  const [settings, set, reset] = useSettings()
  return (
    <div className="site-theme">
      <div className="site-theme-group">
        <span className="site-theme-label">accent</span>
        <div className="site-swatches">
          {Object.entries(TONES).map(([name, hex]) => (
            <button
              key={name}
              type="button"
              className="site-swatch"
              style={{ background: hex }}
              aria-label={name}
              title={name}
              aria-pressed={settings.accent === name}
              onClick={() => set({ accent: name })}
            />
          ))}
          <label className="site-swatch site-swatch-custom" title="any colour">
            <input
              type="color"
              aria-label="custom accent"
              value={settings.accent.startsWith('#') ? settings.accent : '#ff6600'}
              onChange={(e) => set({ accent: e.target.value })}
            />
          </label>
        </div>
      </div>
      {CHOICES.map((c) => (
        <div className="site-theme-group" key={c.key}>
          <span className="site-theme-label">{c.label}</span>
          <div className="site-chips">
            {c.options.map((o) => (
              <button key={o} type="button" className="site-chip" aria-pressed={settings[c.key] === o} onClick={() => set({ [c.key]: o })}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button type="button" className="site-chip site-theme-reset" onClick={reset}>
        reset
      </button>
    </div>
  )
}
