import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  /** Words in the middle of a horizontal line, lowercased. */
  label?: ReactNode
  /** Keep the label's case. */
  keepCase?: boolean
  ref?: Ref<HTMLDivElement>
}

/**
 * A 1px line between things, across or upright, with an optional label.
 *
 * ```tsx
 * <Divider label="or" />
 * ```
 */
export function Divider(props: DividerProps) {
  const { orientation = 'horizontal', label, keepCase, className, ...rest } = useDefaults('Divider', props)
  const labelled = label != null && orientation === 'horizontal'
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      {...rest}
      className={cx('mt-divider', className)}
      data-orientation={orientation}
      data-labelled={flag(labelled)}
      data-keep-case={flag(keepCase)}
    >
      {labelled && <span className="mt-divider-label">{label}</span>}
    </div>
  )
}
