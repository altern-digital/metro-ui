import type { ChangeEvent, CSSProperties, InputHTMLAttributes, ReactNode, Ref } from 'react'
import { useUncontrolled } from '@mantine/hooks'
import { useDefaults, useLocale } from '../../../config/context'
import { cx, flag } from '../../../utils'

export interface ToggleSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'defaultChecked' | 'onChange' | 'children'> {
  /** The setting's name, above the switch (muted, lowercase). Also its spoken name. */
  label?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void
  /** Text beside the switch while on. Default `on`. Pass `null` to hide the state text. */
  onLabel?: ReactNode
  /** Text beside the switch while off. Default `off`. */
  offLabel?: ReactNode
  /** Goes on the root `<label>`; other props go on the native `<input>`. */
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLInputElement>
}

/**
 * The Windows 8 / Windows Phone toggle: a square outlined track with a
 * square thumb that slides across, the track filling with the accent when
 * on, and the word "on" or "off" beside it. A native checkbox with
 * `role="switch"` underneath.
 *
 * ```tsx
 * <ToggleSwitch label="wi-fi" defaultChecked />
 * ```
 */
export function ToggleSwitch(props: ToggleSwitchProps) {
  const t = useLocale()
  const { label, checked, defaultChecked, onChange, onLabel = t.on, offLabel = t.off, className, style, disabled, ...rest } = useDefaults('ToggleSwitch', props)
  const [on, setOn] = useUncontrolled<boolean>({ value: checked, defaultValue: defaultChecked, finalValue: false, onChange })
  const state = on ? onLabel : offLabel

  return (
    <label className={cx('mt-toggle-switch', className)} style={style} data-checked={flag(on)} data-disabled={flag(disabled)}>
      {label != null && <span className="mt-toggle-switch-label">{label}</span>}
      <span className="mt-toggle-switch-row">
        <input
          {...rest}
          type="checkbox"
          role="switch"
          className="mt-toggle-switch-input mt-visually-hidden"
          checked={on}
          aria-checked={on}
          disabled={disabled}
          onChange={(e) => setOn(e.currentTarget.checked, e)}
        />
        <span className="mt-toggle-switch-track" aria-hidden>
          <span className="mt-toggle-switch-thumb" />
        </span>
        {state != null && (
          <span className="mt-toggle-switch-state" aria-hidden>
            {state}
          </span>
        )}
      </span>
    </label>
  )
}
