import { useConfig } from '../config/context'
import type { Platform } from '../config/theme'

/**
 * Picks between a mobile and a desktop form. `force` overrides the provider,
 * for a component that takes its own `variant`/`platform` prop.
 *
 * ```ts
 * const asSheet = useAdaptive({ mobile: true, desktop: false })
 * ```
 */
export function useAdaptive<T>(forms: Record<Platform, T>, force?: Platform | 'auto'): T {
  const { platform } = useConfig()
  return forms[force && force !== 'auto' ? force : platform]
}
