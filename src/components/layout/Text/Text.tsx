import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'

export type TextSize = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'display'
export type TextTone = 'default' | 'muted' | 'accent' | 'danger' | 'success' | 'warning'
export type TextWeight = 200 | 300 | 400 | 600

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** A `--mt-text-*` step. Default: inherit. */
  size?: TextSize
  tone?: TextTone
  weight?: TextWeight
  /** The monospace font (`--mt-mono`). */
  mono?: boolean
  /** One line, cut with an ellipsis. */
  truncate?: boolean
  /** The element to render. Default `span`. */
  as?: ElementType
  ref?: Ref<HTMLElement>
  children?: ReactNode
}

/**
 * Text on the type scale, in a token colour.
 *
 * ```tsx
 * <Text size="sm" tone="muted">updated 2 minutes ago</Text>
 * ```
 */
export function Text(props: TextProps) {
  const { size, tone = 'default', weight, mono, truncate, as: As = 'span', className, ...rest } = useDefaults('Text', props)
  return (
    <As
      {...rest}
      className={cx('mt-text', className)}
      data-size={size}
      data-tone={tone === 'default' ? undefined : tone}
      data-weight={weight}
      data-mono={flag(mono)}
      data-truncate={flag(truncate)}
    />
  )
}
