import type { ComponentType } from 'react'
import type { Category, ComponentDoc } from './docs/types'

/** Everything under docs/, gathered at build time. */

interface ExampleModule {
  default: ComponentType
  title?: string
  description?: string
}

export interface Example {
  id: string
  title: string
  description?: string
  Component: ComponentType
  /** The file as a user would copy it: without the `title` / `description` lines. */
  code: string
}

export interface DocEntry extends ComponentDoc {
  slug: string
  examples: string[]
  demos: Example[]
}

const metas = import.meta.glob<ComponentDoc>('./docs/*/*/meta.ts', { eager: true, import: 'default' })
const modules = import.meta.glob<ExampleModule>('./docs/*/*/examples/*.tsx', { eager: true })
const sources = import.meta.glob<string>('./docs/*/*/examples/*.tsx', { eager: true, query: '?raw', import: 'default' })

export const CATEGORIES: { key: Category; label: string; blurb: string }[] = [
  { key: 'foundation', label: 'foundation', blurb: 'The provider and the pieces everything else is built on.' },
  { key: 'inputs', label: 'inputs', blurb: 'Buttons, fields, toggles and pickers.' },
  { key: 'layout', label: 'layout', blurb: 'Pages, sections, stacks, grids and type.' },
  { key: 'display', label: 'display', blurb: 'Tags, badges, avatars, progress and empty states.' },
  { key: 'data', label: 'tiles & data', blurb: 'Live tiles, the Start grid, lists, tables and charts.' },
  { key: 'feedback', label: 'overlays & feedback', blurb: 'Dialogs, menus, flyouts, toasts and sheets.' },
  { key: 'navigation', label: 'navigation', blurb: 'Pivots, hubs, the navigation pane and command bars.' },
  { key: 'mobile', label: 'mobile', blurb: 'Made for a finger: tab bars, jump lists, swipes.' },
]

export function stripMeta(source: string): string {
  return source
    .replace(/^export const (title|description) = .*\n/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function build(): DocEntry[] {
  const out: DocEntry[] = []
  for (const [path, meta] of Object.entries(metas)) {
    const dir = path.slice(0, -'meta.ts'.length)
    const found = Object.keys(modules)
      .filter((p) => p.startsWith(`${dir}examples/`))
      .map((p) => p.slice(`${dir}examples/`.length, -'.tsx'.length))
      .sort()
    const listed = meta.examples ?? []
    const order = [...listed.filter((e) => found.includes(e)), ...found.filter((e) => !listed.includes(e))]
    const demos = order.map((id): Example => {
      const file = `${dir}examples/${id}.tsx`
      const mod = modules[file]!
      return { id, title: mod.title ?? id, description: mod.description, Component: mod.default, code: stripMeta(sources[file] ?? '') }
    })
    out.push({ ...meta, slug: meta.name, examples: order, demos })
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}

export const DOCS: DocEntry[] = build()
export const DOC_BY_SLUG = new Map(DOCS.map((d) => [d.slug.toLowerCase(), d]))
export const byCategory = (c: Category) => DOCS.filter((d) => d.category === c)
