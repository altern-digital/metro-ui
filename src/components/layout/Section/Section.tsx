import { useId, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The group's name, lowercased. */
  title?: ReactNode
  /** A muted line under the title. */
  description?: ReactNode
  /** Buttons on the right of the title. */
  actions?: ReactNode
  /** The title's element. Default `h2`. */
  titleAs?: ElementType
  /** Keep the title's case. */
  keepCase?: boolean
  ref?: Ref<HTMLElement>
  children?: ReactNode
}

/**
 * A titled part of a page: a light lowercase header, its actions, then the content.
 *
 * ```tsx
 * <Section title="accounts" actions={<Button icon={VscAdd} aria-label="add" />}>…</Section>
 * ```
 */
export function Section(props: SectionProps) {
  const { title, description, actions, titleAs: Heading = 'h2', keepCase, className, children, ...rest } = useDefaults('Section', props)
  const id = useId()
  const hasHeader = title != null || actions != null
  return (
    <section aria-labelledby={title != null ? id : undefined} {...rest} className={cx('mt-section', className)}>
      {hasHeader && (
        <header className="mt-section-header">
          {title != null && (
            <Heading id={id} className="mt-section-title" data-keep-case={flag(keepCase)}>
              {title}
            </Heading>
          )}
          {actions != null && <div className="mt-section-actions">{actions}</div>}
        </header>
      )}
      {description != null && <p className="mt-section-description">{description}</p>}
      {children}
    </section>
  )
}
