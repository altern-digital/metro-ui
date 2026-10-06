import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import { cx, flag } from '../../../utils'
import { Subtitle, Title } from '../Title/Title'

export interface PageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The page title: a level-1 Title (42px, weight 200, lowercase). */
  title?: ReactNode
  /** A muted line under the title. Not lowercased. */
  subtitle?: ReactNode
  /** Buttons on the right of the header. */
  actions?: ReactNode
  /** Shows a back arrow before the title, labelled with the locale's `back`. */
  onBack?: () => void
  /** Your own back control in place of the arrow (a router link, say). Wins over `onBack`. */
  back?: ReactNode
  /** Between the header and the body: a Pivot or tabs. */
  pivot?: ReactNode
  /** No padding around the body, for content that runs to the edges. */
  bleed?: boolean
  /** Keep the title's case. */
  keepCase?: boolean
  ref?: Ref<HTMLDivElement>
  children?: ReactNode
}

/**
 * A full screen: a header with the big lowercase title, then a body that
 * scrolls on its own. Fill a box with a height (the viewport, a pane).
 *
 * ```tsx
 * <Page title="settings" subtitle="this device" actions={<Button>save</Button>}>…</Page>
 * ```
 */
export function Page(props: PageProps) {
  const { title, subtitle, actions, onBack, back, pivot, bleed, keepCase, className, children, ...rest } = useDefaults('Page', props)
  const locale = useLocale()
  const backNode =
    back ??
    (onBack && (
      <button type="button" className="mt-page-back" aria-label={locale.back} onClick={onBack} data-mt-press="" data-mt-hover="">
        <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
          <path d="M14 8H2.5M7.5 3 2.5 8l5 5" />
        </svg>
      </button>
    ))
  const hasHeader = title != null || subtitle != null || actions != null || backNode
  return (
    <div {...rest} className={cx('mt-page', className)} data-bleed={flag(bleed)}>
      {hasHeader && (
        <header className="mt-page-header">
          {backNode}
          <div className="mt-page-heading">
            {title != null && (
              <Title level={1} keepCase={keepCase}>
                {title}
              </Title>
            )}
            {subtitle != null && <Subtitle>{subtitle}</Subtitle>}
          </div>
          {actions != null && <div className="mt-page-actions">{actions}</div>}
        </header>
      )}
      {pivot != null && <div className="mt-page-pivot">{pivot}</div>}
      <div className="mt-page-body">{children}</div>
    </div>
  )
}
