import { useState, type ElementType, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import { cx } from '../../../utils'

export interface BreadcrumbItem {
  key: string
  label: ReactNode
  href?: string
  onClick?: (event: MouseEvent) => void
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  /** With more items than this, the middle ones fold into "…" (press it to show them). Default: never fold. */
  maxItems?: number
  /** The component links render with, e.g. Next.js `Link`. Default `a`. */
  linkComponent?: ElementType
  /** Spoken name of the trail. Default `breadcrumb`. */
  'aria-label'?: string
  ref?: Ref<HTMLElement>
}

const Chevron = () => (
  <svg className="mt-breadcrumb-sep" width="1em" height="1em" viewBox="0 0 16 16" aria-hidden>
    <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
  </svg>
)

/**
 * Where you are, as Windows 10's breadcrumb bar: each level a link, chevrons
 * between, the last one the current page. Long trails fold their middle.
 */
export function Breadcrumb(props: BreadcrumbProps) {
  const t = useLocale()
  const { items, maxItems, linkComponent, className, 'aria-label': label = t.breadcrumb, ...rest } = useDefaults('Breadcrumb', props)
  const locale = useLocale()
  const [unfolded, setUnfolded] = useState(false)
  const Link = (linkComponent ?? 'a') as ElementType
  const fold = !unfolded && maxItems != null && maxItems >= 2 && items.length > maxItems
  const shown: (BreadcrumbItem | 'more')[] = fold ? [items[0]!, 'more', ...items.slice(items.length - (maxItems - 1))] : items

  return (
    <nav {...rest} aria-label={label} className={cx('mt-breadcrumb', className)}>
      <ol className="mt-breadcrumb-list">
        {shown.map((item, i) => {
          const last = i === shown.length - 1
          let node: ReactNode
          if (item === 'more')
            node = (
              <button type="button" className="mt-breadcrumb-link" aria-label={locale.more} data-mt-press="" onClick={() => setUnfolded(true)}>
                …
              </button>
            )
          else if (last)
            node = (
              <span className="mt-breadcrumb-current" aria-current="page">
                {item.label}
              </span>
            )
          else if (item.href !== undefined)
            node = (
              <Link className="mt-breadcrumb-link" href={item.href} onClick={item.onClick} data-mt-press="">
                {item.label}
              </Link>
            )
          else if (item.onClick)
            node = (
              <button type="button" className="mt-breadcrumb-link" onClick={item.onClick} data-mt-press="">
                {item.label}
              </button>
            )
          else node = <span className="mt-breadcrumb-text">{item.label}</span>
          return (
            <li key={item === 'more' ? '…' : item.key} className="mt-breadcrumb-item">
              {node}
              {!last && <Chevron />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
