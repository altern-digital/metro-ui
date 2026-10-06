import { isValidElement, type HTMLAttributes, type ReactNode } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import { cx } from '../../../utils'
import { Button } from '../../inputs/Button/Button'
import { EmptyState } from '../EmptyState/EmptyState'
import { ProgressRing } from '../ProgressRing/ProgressRing'

export type PageState = 'loading' | 'empty' | 'error' | 'ready'

export interface PageStatesProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  state: PageState
  /** What shows once `ready`. */
  children?: ReactNode
  /** Words next to the ring. Default: the locale's `loading`. */
  loading?: ReactNode
  /** Text for the empty state's title (default: the locale's `empty`), or your own element (an `<EmptyState>`). */
  empty?: ReactNode
  /** What went wrong, under the locale's `error`. An `Error` shows its message. */
  error?: ReactNode | Error
  /** Shows a retry button (the locale's `retry`) in the error state. */
  onRetry?: () => void
}

/**
 * One of a page's four states: loading, empty, failed, or its content.
 *
 * ```tsx
 * <PageStates state={query.status} error={query.error} onRetry={query.refetch}>…</PageStates>
 * ```
 */
export function PageStates(props: PageStatesProps) {
  const { state, children, loading, empty, error, onRetry, className, ...rest } = useDefaults('PageStates', props)
  const locale = useLocale()

  if (state === 'ready') return <>{children}</>

  if (state === 'loading') {
    return (
      <div role="status" {...rest} className={cx('mt-page-states', className)} data-state="loading">
        <ProgressRing size="sm" aria-hidden />
        <span>{loading ?? locale.loading}</span>
      </div>
    )
  }

  if (state === 'empty') {
    return (
      <div {...rest} className={cx('mt-page-states', className)} data-state="empty">
        {isValidElement(empty) ? empty : <EmptyState title={empty ?? locale.empty} />}
      </div>
    )
  }

  const message = error instanceof Error ? error.message : error
  return (
    <div role="alert" {...rest} className={cx('mt-page-states', className)} data-state="error">
      <div className="mt-page-states-message">
        <strong>{locale.error}</strong>
        {message != null && message !== '' && <span>{message}</span>}
      </div>
      {onRetry && <Button onClick={onRetry}>{locale.retry}</Button>}
    </div>
  )
}
