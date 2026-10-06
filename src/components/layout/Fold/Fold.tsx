import { useUncontrolled } from '@mantine/hooks'
import { AnimatePresence, m } from 'motion/react'
import { useId, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { useConfig, useDefaults } from '../../../config/context'
import { folding, presence } from '../../../motion/variants'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'

export interface FoldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The header, the part you press. Lowercased. */
  title: ReactNode
  /** A muted line under the title. */
  description?: ReactNode
  /** An icon before the title. */
  icon?: IconSource
  /** Open (controlled). */
  open?: boolean
  /** Open at first (uncontrolled). */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  /** Keep the title's case. */
  keepCase?: boolean
  ref?: Ref<HTMLDivElement>
  children?: ReactNode
}

export type ExpanderProps = FoldProps

function Foldable({ name, props }: { name: 'fold' | 'expander'; props: FoldProps }) {
  const { title, description, icon, open, defaultOpen, onOpenChange, disabled, keepCase, className, children, ...rest } = props
  const [isOpen, setOpen] = useUncontrolled({ value: open, defaultValue: defaultOpen, finalValue: false, onChange: onOpenChange })
  const { reducedMotion } = useConfig()
  const id = useId()
  const base = `mt-${name}`

  const body = (
    <div className={`${base}-body`} id={`${id}-body`} role="region" aria-labelledby={`${id}-header`}>
      {children}
    </div>
  )

  return (
    <div {...rest} className={cx(base, className)} data-open={flag(isOpen)} data-disabled={flag(disabled)}>
      <button
        type="button"
        id={`${id}-header`}
        className={`${base}-header`}
        aria-expanded={isOpen}
        aria-controls={`${id}-body`}
        disabled={disabled}
        onClick={() => setOpen(!isOpen)}
        data-mt-press=""
        data-mt-hover=""
      >
        {icon != null && <span className={`${base}-icon`}>{renderIcon(icon)}</span>}
        <span className={`${base}-heading`}>
          <span className={`${base}-title`} data-keep-case={flag(keepCase)}>
            {title}
          </span>
          {description != null && <span className={`${base}-description`}>{description}</span>}
        </span>
        <svg className={`${base}-chevron`} viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
          <path d="m3 6 5 5 5-5" />
        </svg>
      </button>
      {reducedMotion ? (
        isOpen && body
      ) : (
        <AnimatePresence initial={false}>
          {isOpen && (
            <m.div key="fold" className={`${base}-fold`} variants={folding} {...presence}>
              {body}
            </m.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

/**
 * A part of a page that folds open and shut by height, so what is below
 * slides rather than jumps. The header row is the button.
 *
 * ```tsx
 * <Fold title="advanced">…</Fold>
 * ```
 */
export function Fold(props: FoldProps) {
  return <Foldable name="fold" props={useDefaults('Fold', props)} />
}

/**
 * Windows 10's Expander: a Fold in a bordered box, for a setting with more
 * under it.
 *
 * ```tsx
 * <Expander title="notifications" description="banners and sounds">…</Expander>
 * ```
 */
export function Expander(props: ExpanderProps) {
  return <Foldable name="expander" props={useDefaults('Expander', props)} />
}
