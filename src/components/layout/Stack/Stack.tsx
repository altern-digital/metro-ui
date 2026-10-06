import type { CSSProperties, ElementType, HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'

/** A `--mt-space-*` step: 0 none, 1 = 4px … 8 = 40px. */
export type SpaceStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

/** A space step as a CSS length. */
export const spaceVar = (step: SpaceStep): string => (step === 0 ? '0px' : `var(--mt-space-${step})`)

export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export interface StackProps extends HTMLAttributes<HTMLElement> {
  direction?: 'row' | 'column'
  /** Space between children, a `--mt-space-*` step. */
  gap?: SpaceStep
  align?: StackAlign
  justify?: StackJustify
  wrap?: boolean
  /** The element to render. Default `div`. */
  as?: ElementType
  ref?: Ref<HTMLElement>
  children?: ReactNode
}

/**
 * Children in a row or a column, spaced on the 4px grid.
 *
 * ```tsx
 * <Stack direction="row" gap={2} align="center">…</Stack>
 * ```
 */
export function Stack(props: StackProps) {
  const { direction = 'column', gap = 3, align, justify, wrap, as: As = 'div', className, style, ...rest } = useDefaults('Stack', props)
  return (
    <As
      {...rest}
      className={cx('mt-stack', className)}
      style={{ '--_gap': spaceVar(gap), ...style } as CSSProperties}
      data-direction={direction}
      data-align={align}
      data-justify={justify}
      data-wrap={flag(wrap)}
    />
  )
}
