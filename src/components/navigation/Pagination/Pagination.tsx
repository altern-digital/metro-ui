import { useUncontrolled } from '@mantine/hooks'
import type { HTMLAttributes, Ref } from 'react'
import { useConfig, useDefaults, useLocale } from '../../../config/context'
import { clamp, cx, flag } from '../../../utils'

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** The current page, from 1. */
  page?: number
  defaultPage?: number
  onChange?: (page: number) => void
  /** The number of pages. Or give `count` and `pageSize`. */
  total?: number
  /** The number of items, with `pageSize`. */
  count?: number
  /** Items per page, with `count`. Default 10. */
  pageSize?: number
  /** Pages shown either side of the current one. Default 1. */
  siblings?: number
  /** Pages shown at each end. Default 1. */
  boundaries?: number
  /** "3 / 12" between the arrows instead of numbers. Default: on a phone. */
  simple?: boolean
  disabled?: boolean
  /** Spoken name. Default `pagination`. */
  'aria-label'?: string
  ref?: Ref<HTMLElement>
}

/** The pages to show, with `null` where a run is left out. */
export function paginationRange(page: number, total: number, siblings = 1, boundaries = 1): (number | null)[] {
  const slots = siblings * 2 + 3 + boundaries * 2
  if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1)
  const run = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)
  const left = Math.max(page - siblings, boundaries + 1)
  const right = Math.min(page + siblings, total - boundaries)
  const gapLeft = left > boundaries + 2
  const gapRight = right < total - boundaries - 1
  const middleSize = siblings * 2 + 1 + boundaries + 1
  if (!gapLeft && gapRight) return [...run(1, middleSize), null, ...run(total - boundaries + 1, total)]
  if (gapLeft && !gapRight) return [...run(1, boundaries), null, ...run(total - middleSize + 1, total)]
  return [...run(1, boundaries), null, ...run(left, right), null, ...run(total - boundaries + 1, total)]
}

const Arrow = ({ back }: { back?: boolean }) => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" aria-hidden>
    <path d={back ? 'M10 3.5 5.5 8 10 12.5' : 'M6 3.5 10.5 8 6 12.5'} fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

/**
 * Flat square page numbers, the current one filled with the accent. On a
 * phone it turns into "3 / 12" between two arrows.
 */
export function Pagination(props: PaginationProps) {
  const t = useLocale()
  const { page, defaultPage, onChange, total, count, pageSize = 10, siblings = 1, boundaries = 1, simple, disabled, className, 'aria-label': label = t.pagination, ...rest } = useDefaults('Pagination', props)
  const { platform, locale } = useConfig()
  const pages = Math.max(1, total ?? Math.ceil((count ?? 0) / pageSize))
  const [raw, setPage] = useUncontrolled({ value: page, defaultValue: defaultPage, finalValue: 1, onChange })
  const current = clamp(raw, 1, pages)
  const isSimple = simple ?? platform === 'mobile'
  const go = (n: number) => {
    const next = clamp(n, 1, pages)
    if (next !== current) setPage(next)
  }

  const arrow = (back: boolean) => (
    <button
      type="button"
      className="mt-pagination-button"
      data-arrow=""
      aria-label={back ? locale.previous : locale.next}
      disabled={disabled || (back ? current <= 1 : current >= pages)}
      onClick={() => go(current + (back ? -1 : 1))}
      data-mt-press=""
      data-mt-hover=""
    >
      <Arrow back={back} />
    </button>
  )

  return (
    <nav {...rest} aria-label={label} className={cx('mt-pagination', className)} data-simple={flag(isSimple)}>
      {arrow(true)}
      {isSimple ? (
        <span className="mt-pagination-status" aria-live="polite">
          {current} / {pages}
        </span>
      ) : (
        paginationRange(current, pages, siblings, boundaries).map((n, i) =>
          n === null ? (
            <span key={`gap${i}`} className="mt-pagination-gap" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              className="mt-pagination-button"
              aria-label={`${locale.page} ${n}`}
              aria-current={n === current ? 'page' : undefined}
              data-selected={flag(n === current)}
              disabled={disabled}
              onClick={() => go(n)}
              data-mt-press=""
              data-mt-hover=""
            >
              {n}
            </button>
          ),
        )
      )}
      {arrow(false)}
    </nav>
  )
}
