import { useFocusTrap, useUncontrolled } from '@mantine/hooks'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, type ButtonHTMLAttributes, type Ref } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import { drill, fade, presence } from '../../../motion/variants'
import { cx, flag } from '../../../utils'
import { Portal } from '../../foundation/Portal/Portal'

/** `#` then a to z, as Windows Phone ordered its jump list. */
export const JUMP_ALPHABET = '#abcdefghijklmnopqrstuvwxyz'.split('')

export interface JumpListProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** The group letters the list has. Their tiles are lit; the rest are dim. */
  groups: string[]
  /** The tiles, in order. Default `#` and a to z. */
  alphabet?: string[]
  /** The list's id: picking `b` scrolls `#${listId}-group-b` into view. */
  listId?: string
  /** Called with the picked letter. */
  onJump?: (letter: string) => void
  /** Spoken name of the grid. Default `jump to`. */
  label?: string
  className?: string
}

/**
 * The Windows Phone jump list: a full-screen grid of letter tiles over a
 * scrim. Letters the list has are accent tiles; picking one jumps to its
 * group. Open it from a group header (`JumpListHeader`).
 */
export function JumpList(props: JumpListProps) {
  const t = useLocale()
  const { open, defaultOpen, onOpenChange, groups, alphabet = JUMP_ALPHABET, listId, onJump, label = t.jumpTo, className } = useDefaults('JumpList', props)
  const [isOpen, setOpen] = useUncontrolled({ value: open, defaultValue: defaultOpen, finalValue: false, onChange: onOpenChange })
  const trap = useFocusTrap(isOpen)
  const present = new Set(groups.map((g) => g.toLowerCase()))

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, setOpen])

  const jump = (letter: string) => {
    onJump?.(letter)
    if (listId) document.getElementById(`${listId}-group-${letter}`)?.scrollIntoView?.({ block: 'start' })
    setOpen(false)
  }

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <m.div key="jump" className={cx('mt-jump-list', className)} variants={fade} {...presence} onClick={() => setOpen(false)}>
            <m.div ref={trap} role="dialog" aria-modal="true" aria-label={label} className="mt-jump-list-grid" variants={drill} {...presence} onClick={(e) => e.stopPropagation()}>
              {alphabet.map((letter) => {
                const has = present.has(letter.toLowerCase())
                return (
                  <button
                    key={letter}
                    type="button"
                    className="mt-jump-list-tile"
                    disabled={!has}
                    data-present={flag(has)}
                    onClick={() => jump(letter)}
                    data-mt-press=""
                  >
                    {letter}
                  </button>
                )
              })}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}

export interface JumpListHeaderProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The group's letter. */
  letter: string
  ref?: Ref<HTMLButtonElement>
}

/** A group header for a jump list: a small square outlined in the accent, holding its letter. Press it to open the JumpList. */
export function JumpListHeader(props: JumpListHeaderProps) {
  const { letter, className, children, ...rest } = useDefaults('JumpListHeader', props)
  return (
    <button type="button" {...rest} className={cx('mt-jump-list-header', className)} data-mt-press="">
      <span className="mt-jump-list-header-letter">{letter}</span>
      {children}
    </button>
  )
}
