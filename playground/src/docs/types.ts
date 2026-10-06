/**
 * What each component's documentation page is built from. A component's docs
 * live in `playground/src/docs/<category>/<Name>/`:
 *
 * - `meta.ts`: `export default { … } satisfies ComponentDoc`
 * - `examples/<Example>.tsx`: one live example each. The default export is a
 *   component that renders it; `export const title` and `export const
 *   description` describe it. The site shows the file's source as the code
 *   sample, with those two lines removed, so write it as the code a user
 *   would copy: import from '@altern-digital/metro-ui', no docs helpers.
 */

export type Category = 'foundation' | 'inputs' | 'layout' | 'display' | 'data' | 'feedback' | 'navigation' | 'mobile'

/** Where a component is meant to be used. `adaptive` changes form between mobile and desktop by itself. */
export type PlatformTag = 'all' | 'mobile' | 'desktop' | 'adaptive'

export interface PropDoc {
  name: string
  /** As a user would write it: `'sm' | 'md' | 'lg'`, `(value: string) => void`. */
  type: string
  default?: string
  description: string
  required?: boolean
}

export interface ComponentDoc {
  /** As exported, e.g. `Button`. */
  name: string
  category: Category
  /** One sentence for the gallery card. */
  summary: string
  platform: PlatformTag
  /** Longer notes: when to use it, how it adapts. Plain text; blank lines separate paragraphs, `code` in backticks. */
  description?: string
  /** Other exports documented on the same page (`IconButton`, `useDialog`). */
  related?: string[]
  /** Example file names in display order, without `.tsx`. Unlisted examples come after, alphabetically. */
  examples?: string[]
  props: PropDoc[]
  /** Props of related components or hooks, by name. */
  extraProps?: Record<string, PropDoc[]>
  /** Keyboard and screen-reader behaviour. */
  accessibility?: string[]
}
