import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** A big muted glyph above the title. */
  icon?: IconSource
  /** What is missing, light and lowercase. */
  title?: ReactNode
  /** What to do about it. */
  description?: ReactNode
  /** A button or two. */
  action?: ReactNode
  /** `center` (default) for a whole panel, `start` to sit with the content around it. */
  align?: 'center' | 'start'
  /** Keep the title's case. */
  keepCase?: boolean
  ref?: Ref<HTMLDivElement>
  children?: ReactNode
}

/**
 * Nothing here (yet), and what to do about it.
 *
 * ```tsx
 * <EmptyState icon={VscInbox} title="no messages" description="new mail lands here" />
 * ```
 */
export function EmptyState(props: EmptyStateProps) {
  const { icon, title, description, action, align = 'center', keepCase, className, children, ...rest } = useDefaults('EmptyState', props)
  return (
    <div {...rest} className={cx('mt-empty-state', className)} data-align={align}>
      {icon != null && (
        <span className="mt-empty-state-icon" aria-hidden>
          {renderIcon(icon)}
        </span>
      )}
      {title != null && (
        <p className="mt-empty-state-title" data-keep-case={flag(keepCase)}>
          {title}
        </p>
      )}
      {description != null && <p className="mt-empty-state-description">{description}</p>}
      {children}
      {action != null && <div className="mt-empty-state-action">{action}</div>}
    </div>
  )
}
