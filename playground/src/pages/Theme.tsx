import { Code } from '../site/Code'
import { DEFAULT_SETTINGS, useSettings } from '../site/settings'
import { ThemePanel } from '../site/ThemePanel'
import { Sampler } from './Sampler'

/** The theme builder: the panel changes the whole site; the code to get the same look comes out below. */
export function Theme() {
  const [s] = useSettings()
  const theme: string[] = []
  if (s.mode !== DEFAULT_SETTINGS.mode) theme.push(`mode: '${s.mode}'`)
  if (s.accent !== DEFAULT_SETTINGS.accent) theme.push(`accent: '${s.accent}'`)
  const props: string[] = []
  if (theme.length) props.push(`theme={{ ${theme.join(', ')} }}`)
  if (s.density !== 'auto') props.push(`density="${s.density}"`)
  if (s.platform !== 'auto') props.push(`platform="${s.platform}"`)
  if (s.motion !== 'auto') props.push(`motion="${s.motion}"`)
  if (s.locale === 'id') props.push('locale={LOCALE_ID}')
  const imports = s.locale === 'id' ? 'ConfigProvider, LOCALE_ID' : 'ConfigProvider'
  const open = props.length > 1 ? `<ConfigProvider\n  ${props.join('\n  ')}\n>` : `<ConfigProvider${props.length ? ` ${props[0]}` : ''}>`
  const code = `import '@altern-digital/metro-ui/styles.css'\nimport { ${imports} } from '@altern-digital/metro-ui'\n\n${open}\n  <App />\n</ConfigProvider>`

  return (
    <div className="site-themepage">
      <h1 className="site-h1">theme</h1>
      <p className="site-lead">Pick an accent and the rest. The whole site follows, and the code to get the same look is below.</p>
      <div className="site-themepage-grid">
        <div>
          <ThemePanel />
          <Code code={code} />
        </div>
        <Sampler />
      </div>
    </div>
  )
}
