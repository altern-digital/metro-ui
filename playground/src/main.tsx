import '@altern-digital/metro-ui/styles.css'
import './site.css'
import { ConfigProvider, LOCALE_ID } from '@altern-digital/metro-ui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ComponentPage } from './pages/ComponentPage'
import { Components } from './pages/Components'
import { Docs } from './pages/Docs'
import { Home } from './pages/Home'
import { Playground } from './pages/Playground'
import { Theme } from './pages/Theme'
import { useRoute } from './router'
import { SettingsProvider } from './site/settings'
import { Shell } from './site/Shell'

function Page() {
  const [section, sub] = useRoute()
  switch (section) {
    case 'docs':
      return <Docs slug={sub} />
    case 'components':
      return sub ? <ComponentPage slug={sub} /> : <Components />
    case 'playground':
      return <Playground />
    case 'theme':
      return <Theme />
    default:
      return <Home />
  }
}

function App() {
  return (
    <SettingsProvider>
      {(s) => (
        <ConfigProvider
          theme={{ mode: s.mode, accent: s.accent }}
          density={s.density}
          platform={s.platform}
          motion={s.motion}
          locale={s.locale === 'id' ? LOCALE_ID : undefined}
          className="site-root"
        >
          <Shell>
            <Page />
          </Shell>
        </ConfigProvider>
      )}
    </SettingsProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
