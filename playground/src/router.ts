import { useSyncExternalStore } from 'react'

/**
 * Hash routes, so the site works on GitHub Pages without a 404 fallback:
 * `#/`, `#/docs/<guide>`, `#/components`, `#/components/<Name>`,
 * `#/playground`, `#/theme`.
 */
const subscribe = (fn: () => void) => {
  window.addEventListener('hashchange', fn)
  return () => window.removeEventListener('hashchange', fn)
}
const read = () => window.location.hash.replace(/^#/, '') || '/'

export function useRoute(): string[] {
  const path = useSyncExternalStore(subscribe, read, () => '/')
  return path.split('?')[0]!.split('/').filter(Boolean)
}

export const href = (path: string) => `#${path}`

export function go(path: string) {
  window.location.hash = path
}
