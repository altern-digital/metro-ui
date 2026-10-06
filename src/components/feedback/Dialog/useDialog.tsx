import { useMemo, useRef, useState, type ReactNode } from 'react'
import { useLocale } from '../../../config/context'
import { useLayers } from '../../../config/layers'
import { Dialog, type DialogAction } from './Dialog'

export interface DialogOptions {
  title?: ReactNode
  content?: ReactNode
  /** Default the locale's `ok`. */
  okText?: ReactNode
  /** Default the locale's `cancel`. */
  cancelText?: ReactNode
  /** The OK button turns red and focus starts on cancel. */
  danger?: boolean
}

export interface PromptOptions extends DialogOptions {
  defaultValue?: string
  placeholder?: string
  /** Names the field for screen readers. Default: the title when it is text. */
  inputLabel?: string
}

export interface DialogApi {
  /** Resolves `true` on OK, `false` on cancel, Escape or the scrim. */
  confirm(options: DialogOptions): Promise<boolean>
  /** Resolves once it is dismissed. */
  alert(options: DialogOptions): Promise<void>
  /** Resolves the text on OK (Enter works too), `null` otherwise. */
  prompt(options: PromptOptions): Promise<string | null>
}

type Kind = 'confirm' | 'alert' | 'prompt'

let nextId = 0

/**
 * Dialogs as promises, for the questions code asks in the middle of doing
 * something. Needs a ConfigProvider above it.
 *
 * ```ts
 * const dialog = useDialog()
 * if (await dialog.confirm({ title: 'delete this file?', danger: true })) remove()
 * ```
 */
export function useDialog(): DialogApi {
  const layers = useLayers()
  return useMemo(() => {
    const open = <T,>(kind: Kind, options: PromptOptions, cancelled: T) =>
      new Promise<T>((resolve) => {
        const key = `metro-dialog-${++nextId}`
        layers.set(key, <ImperativeDialog key={key} kind={kind} options={options} cancelled={cancelled} onResult={resolve} onGone={() => layers.remove(key)} />)
      })
    return {
      confirm: (options) => open<boolean>('confirm', options, false),
      alert: (options) => open<void>('alert', options, undefined),
      prompt: (options) => open<string | null>('prompt', options, null),
    }
  }, [layers])
}

interface ImperativeProps<T> {
  kind: Kind
  options: PromptOptions
  cancelled: T
  onResult: (value: T) => void
  onGone: () => void
}

function ImperativeDialog<T>({ kind, options, cancelled, onResult, onGone }: ImperativeProps<T>) {
  const locale = useLocale()
  const [open, setOpen] = useState(true)
  const [text, setText] = useState(options.defaultValue ?? '')
  const done = useRef(false)
  const finish = (value: unknown) => {
    if (done.current) return
    done.current = true
    onResult(value as T)
    setOpen(false)
  }
  const ok = () => finish(kind === 'confirm' ? true : kind === 'prompt' ? text : undefined)
  const { title, content, okText = locale.ok, cancelText = locale.cancel, danger } = options

  const actions: DialogAction[] = [{ label: okText, variant: danger ? 'danger' : 'accent', autoFocus: !danger && kind !== 'prompt', onClick: ok }]
  if (kind !== 'alert') actions.push({ label: cancelText, autoFocus: danger && kind !== 'prompt', onClick: () => finish(cancelled) })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && finish(cancelled)}
      onExitComplete={onGone}
      title={title}
      size="sm"
      role={kind === 'alert' || danger ? 'alertdialog' : 'dialog'}
      actions={actions}
    >
      {content}
      {kind === 'prompt' && (
        <input
          className="mt-dialog-input"
          value={text}
          placeholder={options.placeholder}
          aria-label={options.inputLabel ?? (typeof title === 'string' ? title : undefined)}
          data-autofocus=""
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' || e.nativeEvent.isComposing) return
            e.preventDefault()
            ok()
          }}
        />
      )}
    </Dialog>
  )
}
