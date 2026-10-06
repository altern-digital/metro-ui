import { useFocusTrap, useId, useMergedRef, useUncontrolled } from '@mantine/hooks'
import { AnimatePresence, m, useIsPresent } from 'motion/react'
import { useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import { useAdaptive } from '../../../hooks/useAdaptive'
import { drill, fade, presence, sheet } from '../../../motion/variants'
import { cx, flag } from '../../../utils'
import { Portal } from '../../foundation/Portal/Portal'
import { Button, type ButtonVariant } from '../../inputs/Button/Button'
import type { MotionSafe } from '../_overlay/Floating'
import { OwnerContext, useEscape, useOwnerChain, useReturnFocus, useScrollLock } from '../_overlay/dismiss'
import { CloseGlyph } from '../_overlay/glyphs'

export interface DialogAction {
  label: ReactNode
  /** Default `default`; make the main one `accent` (or `danger`). */
  variant?: ButtonVariant
  /**
   * Runs on press, then the dialog closes. Return `false` to keep it open;
   * return a promise to show the button loading until it settles.
   */
  onClick?: () => void | boolean | Promise<void | boolean>
  /** Takes focus when the dialog opens. */
  autoFocus?: boolean
  disabled?: boolean
}

export type DialogSize = 'sm' | 'md' | 'lg'

export interface DialogProps extends MotionSafe<Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'>> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Light, lowercase heading; it names the dialog for screen readers. */
  title?: ReactNode
  /** The body; it describes the dialog for screen readers. */
  children?: ReactNode
  /** Buttons along the bottom, right-aligned, in order. */
  actions?: DialogAction[]
  /** Your own footer instead of `actions`. */
  footer?: ReactNode
  /** Escape and a press on the scrim close it (mobile: a close button too). Default true. */
  dismissible?: boolean
  /** Width of the content column on the desktop: 440, 560 (default) or 760px. */
  size?: DialogSize
  /** `auto` (default) follows the provider: a band across the screen on the desktop, a full-screen page on mobile. */
  platform?: 'auto' | 'mobile' | 'desktop'
  /** Label of the mobile close button. Default the locale's `close`. */
  closeLabel?: string
  /** After the closing animation, when it has left the page. */
  onExitComplete?: () => void
  /** The dialog element. */
  ref?: Ref<HTMLDivElement>
}

/**
 * A Metro message dialog: a band across the middle of the screen over a
 * scrim, with a light lowercase title and the buttons at the right. It
 * drills in and out. On mobile it is a full-screen page that rises from the
 * bottom. Focus stays inside while open and goes back where it was after.
 *
 * ```tsx
 * <Dialog open={open} onOpenChange={setOpen} title="delete 3 files?"
 *   actions={[{ label: 'delete', variant: 'danger', onClick: remove }, { label: 'cancel' }]}>
 *   They go to the recycle bin.
 * </Dialog>
 * ```
 */
export function Dialog(props: DialogProps) {
  const { open, defaultOpen, onOpenChange, onExitComplete, ...rest } = useDefaults('Dialog', props)
  const [isOpen, setOpen] = useUncontrolled({ value: open, defaultValue: defaultOpen, finalValue: false, onChange: onOpenChange })
  return (
    <Portal>
      <AnimatePresence onExitComplete={onExitComplete}>{isOpen && <Surface key="dialog" {...rest} onClose={() => setOpen(false)} />}</AnimatePresence>
    </Portal>
  )
}

type SurfaceProps = Omit<DialogProps, 'open' | 'defaultOpen' | 'onOpenChange' | 'onExitComplete'> & { onClose: () => void }

const WIDTH: Record<DialogSize, number> = { sm: 440, md: 560, lg: 760 }

function Surface({ title, children, actions, footer, dismissible = true, size = 'md', platform = 'auto', closeLabel, onClose, ref, className, style, ...rest }: SurfaceProps) {
  const locale = useLocale()
  const mobile = useAdaptive({ mobile: true, desktop: false }, platform)
  const id = useId()
  const chain = useOwnerChain(id)
  const present = useIsPresent()
  const local = useRef<HTMLDivElement>(null)
  const trap = useFocusTrap(present)
  const merged = useMergedRef(local, trap, ref)
  const [busy, setBusy] = useState<number | null>(null)
  const [returnTo] = useState(() => (typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null)))
  const titleId = `${id}-title`
  const bodyId = `${id}-body`

  useScrollLock(present)
  useEscape(present && dismissible, onClose)
  useReturnFocus(present, () => returnTo, () => local.current)

  const press = async (action: DialogAction, i: number) => {
    const result = action.onClick?.()
    if (result instanceof Promise) {
      setBusy(i)
      try {
        if ((await result) === false) return
      } finally {
        setBusy(null)
      }
    } else if (result === false) return
    onClose()
  }

  const buttons =
    footer ??
    (actions && actions.length > 0 && (
      <>
        {actions.map((action, i) => (
          <Button
            key={i}
            variant={action.variant ?? 'default'}
            disabled={action.disabled || (busy !== null && busy !== i)}
            loading={busy === i}
            data-autofocus={action.autoFocus ? '' : undefined}
            onClick={() => void press(action, i)}
          >
            {action.label}
          </Button>
        ))}
      </>
    ))

  const content = (
    <>
      {(title != null || (mobile && dismissible)) && (
        <div className="mt-dialog-header">
          {title != null && (
            <h2 id={titleId} className="mt-dialog-title">
              {title}
            </h2>
          )}
          {mobile && dismissible && (
            <button type="button" className="mt-dialog-close" aria-label={closeLabel ?? locale.close} onClick={onClose} data-mt-press="" data-mt-hover="">
              <CloseGlyph />
            </button>
          )}
        </div>
      )}
      {children != null && (
        <div id={bodyId} className="mt-dialog-body">
          {children}
        </div>
      )}
      {buttons && <div className="mt-dialog-actions">{buttons}</div>}
    </>
  )

  return (
    <OwnerContext value={chain}>
      <m.div className="mt-dialog-scrim" variants={fade} {...presence} aria-hidden />
      <div
        className="mt-dialog-layer"
        data-platform={mobile ? 'mobile' : 'desktop'}
        data-mt-owner={chain}
        style={present ? undefined : { pointerEvents: 'none' }}
        // A press on the scrim around the band, not one that ends there after a drag from inside.
        onPointerDown={(e) => dismissible && !mobile && e.target === e.currentTarget && onClose()}
      >
        <m.div
          {...rest}
          ref={merged}
          role={rest.role ?? 'dialog'}
          aria-modal="true"
          aria-labelledby={title != null ? titleId : rest['aria-labelledby']}
          aria-describedby={children != null ? bodyId : rest['aria-describedby']}
          tabIndex={-1}
          className={cx('mt-dialog', className)}
          data-size={size}
          data-dismissible={flag(dismissible)}
          style={style}
          variants={mobile ? sheet : drill}
          {...presence}
          inert={!present}
        >
          {mobile ? (
            content
          ) : (
            <div className="mt-dialog-column" style={{ maxWidth: WIDTH[size] }}>
              {content}
            </div>
          )}
        </m.div>
      </div>
    </OwnerContext>
  )
}
