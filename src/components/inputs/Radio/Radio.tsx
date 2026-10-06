import { createContext, useContext, type ChangeEvent, type CSSProperties, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'
import { useId, useUncontrolled } from '@mantine/hooks'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'

interface RadioGroupContext {
  name: string
  value: string | null
  disabled?: boolean
  select: (value: string, event: ChangeEvent<HTMLInputElement>) => void
}

const GroupContext = createContext<RadioGroupContext | null>(null)

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'checked' | 'defaultChecked' | 'onChange' | 'children'> {
  /** What the group's value becomes when this one is picked. */
  value: string
  label?: ReactNode
  /** Smaller muted text under the label. */
  description?: ReactNode
  /** Outside a RadioGroup only. Inside one, the group decides. */
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void
  /** Goes on the root `<label>`; other props go on the native `<input>`. */
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLInputElement>
}

/**
 * A radio button. Use it inside a RadioGroup, which gives every radio the
 * same `name` so the browser handles arrow keys between them.
 */
export function Radio(props: RadioProps) {
  const { value, label, description, checked, defaultChecked, onChange, className, style, id: idProp, disabled: disabledProp, name: nameProp, 'aria-describedby': describedBy, ...rest } = useDefaults('Radio', props)
  const group = useContext(GroupContext)
  const id = useId(idProp)
  const [own, setOwn] = useUncontrolled<boolean>({ value: checked, defaultValue: defaultChecked, finalValue: false, onChange })
  const on = group ? group.value === value : own
  const disabled = disabledProp || group?.disabled
  const descriptionId = description != null ? `${id}-description` : undefined

  return (
    <label className={cx('mt-radio', className)} style={style} data-checked={flag(on)} data-disabled={flag(disabled)}>
      <input
        {...rest}
        id={id}
        type="radio"
        className="mt-radio-input mt-visually-hidden"
        name={group?.name ?? nameProp}
        value={value}
        checked={on}
        disabled={disabled}
        aria-describedby={cx(describedBy, descriptionId) || undefined}
        onChange={(e) => (group ? group.select(value, e) : setOwn(e.currentTarget.checked, e))}
      />
      {/* Radios are round, as in Windows 8 and 10: one of the allowed circles. */}
      <span className="mt-radio-circle" aria-hidden />
      {(label != null || description != null) && (
        <span className="mt-radio-text">
          {label != null && <span className="mt-radio-label">{label}</span>}
          {description != null && (
            <span id={descriptionId} className="mt-radio-description" aria-hidden>
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  )
}

export interface RadioOption {
  value: string
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The radios as data. Or pass `<Radio>` children. */
  options?: RadioOption[]
  value?: string | null
  defaultValue?: string | null
  onChange?: (value: string) => void
  /** Shared `name` of the radios. Default: a generated one. */
  name?: string
  /** Shown above the radios, muted and lowercase, and used as the group's name. */
  label?: ReactNode
  /** Default `vertical`. */
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  ref?: Ref<HTMLDivElement>
}

/**
 * A set of radios with one value. Arrow keys move and select within the
 * group, as native radios sharing a name do.
 *
 * ```tsx
 * <RadioGroup label="theme" options={[{ value: 'dark', label: 'dark' }, { value: 'light', label: 'light' }]} />
 * ```
 */
export function RadioGroup(props: RadioGroupProps) {
  const { options, value, defaultValue, onChange, name, label, orientation = 'vertical', disabled, className, children, ...rest } = useDefaults('RadioGroup', props)
  const id = useId()
  const [current, setCurrent] = useUncontrolled<string | null>({
    value,
    defaultValue,
    finalValue: null,
    onChange: (v) => v != null && onChange?.(v),
  })
  const labelId = label != null ? `${id}-label` : undefined
  const ctx: RadioGroupContext = {
    name: name ?? id,
    value: current,
    disabled,
    select: (v) => setCurrent(v),
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      aria-orientation={orientation}
      aria-disabled={disabled || undefined}
      {...rest}
      className={cx('mt-radio-group', className)}
      data-orientation={orientation}
    >
      {label != null && (
        <div id={labelId} className="mt-radio-group-label">
          {label}
        </div>
      )}
      <div className="mt-radio-group-items">
        <GroupContext value={ctx}>
          {options?.map((o) => <Radio key={o.value} value={o.value} label={o.label} description={o.description} disabled={o.disabled} />)}
          {children}
        </GroupContext>
      </div>
    </div>
  )
}
