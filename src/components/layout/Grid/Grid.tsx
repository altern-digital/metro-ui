import type { CSSProperties, ElementType, HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'
import { spaceVar, type SpaceStep } from '../Stack/Stack'

/** Columns per breakpoint. A missing one takes the next smaller (compact → medium → expanded). */
export interface ResponsiveColumns {
  compact?: number
  medium?: number
  expanded?: number
}

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** How many equal columns, or a count per breakpoint. Default 1. */
  columns?: number | ResponsiveColumns
  /** As many columns as fit at least this wide (px or any CSS length). Wins over `columns`. */
  minChildWidth?: number | string
  /** Space between cells, a `--mt-space-*` step. */
  gap?: SpaceStep
  /** The element to render. Default `div`. */
  as?: ElementType
  ref?: Ref<HTMLElement>
  children?: ReactNode
}

/**
 * A CSS grid of equal columns, fixed, per breakpoint, or as many as fit.
 *
 * ```tsx
 * <Grid columns={{ compact: 1, medium: 2, expanded: 3 }} gap={4}>…</Grid>
 * <Grid minChildWidth={240}>…</Grid>
 * ```
 */
export function Grid(props: GridProps) {
  const { columns = 1, minChildWidth, gap = 3, as: As = 'div', className, style, ...rest } = useDefaults('Grid', props)
  const vars: Record<string, string | number> = { '--_gap': spaceVar(gap) }
  const responsive = typeof columns === 'object'
  if (minChildWidth != null) {
    vars['--_min'] = typeof minChildWidth === 'number' ? `${minChildWidth}px` : minChildWidth
  } else if (responsive) {
    const compact = columns.compact ?? 1
    const medium = columns.medium ?? compact
    vars['--_cols-c'] = compact
    vars['--_cols-m'] = medium
    vars['--_cols-e'] = columns.expanded ?? medium
  } else {
    vars['--_cols'] = columns
  }
  return (
    <As
      {...rest}
      className={cx('mt-grid', className)}
      style={{ ...vars, ...style } as CSSProperties}
      data-auto={flag(minChildWidth != null)}
      data-responsive={flag(minChildWidth == null && responsive)}
    />
  )
}
