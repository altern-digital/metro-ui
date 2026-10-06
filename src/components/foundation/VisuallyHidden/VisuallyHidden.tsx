import type { HTMLAttributes } from 'react'
import { cx } from '../../../utils'

/** Text for screen readers only. */
export function VisuallyHidden({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...rest} className={cx('mt-visually-hidden', className)} />
}
