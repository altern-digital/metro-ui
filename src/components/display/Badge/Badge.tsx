import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'
import { toneColor, type DisplayTone } from '../tone'

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The number to show. */
  count?: number
  /** Above this it shows `max+`. Default 99. */
  max?: number
  /** Show `0` instead of hiding. */
  showZero?: boolean
  /** A small dot instead of a number. */
  dot?: boolean
  /** Default `accent`. */
  tone?: DisplayTone
  /** Spoken text, e.g. "3 unread". Without it the number is read as is; a dot is hidden. */
  label?: string
  /** Something to badge: the badge sits on its top-right corner. */
  children?: ReactNode
  ref?: Ref<HTMLSpanElement>
}

/**
 * A count or a dot. Square, as Metro's live tile counters were; only the
 * dot is round.
 *
 * ```tsx
 * <Badge count={5}><Button icon={VscMail} aria-label="mail" /></Badge>
 * ```
 */
export function Badge(props: BadgeProps) {
  const { count, max = 99, showZero, dot, tone = 'accent', label, className, style, children, ...rest } = useDefaults('Badge', props)
  const visible = dot || (count != null && (count !== 0 || showZero))
  const text = dot ? null : count != null && count > max ? `${max}+` : count
  const badge = visible ? (
    <span
      {...(children == null ? rest : {})}
      className={cx('mt-badge', children == null && className)}
      style={{ '--_tone': toneColor(tone), ...(children == null ? style : undefined) } as CSSProperties}
      data-dot={flag(dot)}
      data-tone={tone}
      aria-label={label}
      aria-hidden={dot && !label ? true : undefined}
      role={label ? 'status' : undefined}
    >
      {text}
    </span>
  ) : null
  if (children == null) return badge
  return (
    <span {...rest} className={cx('mt-badge-anchor', className)} style={style}>
      {children}
      {badge}
    </span>
  )
}
