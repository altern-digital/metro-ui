import { useState, type CSSProperties, type HTMLAttributes, type Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { TONES } from '../../../config/theme'
import { cx } from '../../../utils'
import { toneColor, type DisplayTone } from '../tone'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline'

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** A picture. Falls back to the initials if it fails to load. */
  src?: string
  /** The person's name: the initials, the background tone and the spoken name. */
  name?: string
  /** Spoken name when it differs from `name`. */
  alt?: string
  /** `sm` 32, `md` 40, `lg` 64, `xl` 96, or px. */
  size?: AvatarSize | number
  /** Square, as in the Windows Phone people hub, or a circle. */
  shape?: 'square' | 'circle'
  /** The background behind the initials. Default: a Metro tone picked from the name, the same every time. */
  tone?: DisplayTone
  /** A presence dot in the corner. */
  status?: AvatarStatus
  ref?: Ref<HTMLSpanElement>
}

const SIZES: Record<AvatarSize, number> = { sm: 32, md: 40, lg: 64, xl: 96 }
const TONE_NAMES = Object.keys(TONES) as (keyof typeof TONES)[]

/** A tone for a name: a string hash onto the 13 Metro tones, stable across renders and servers. */
export function toneForName(name: string): keyof typeof TONES {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return TONE_NAMES[Math.abs(hash) % TONE_NAMES.length]!
}

/** Up to two initials: the first letters of the first and last words. */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  const first = [...words[0]!][0] ?? ''
  const last = words.length > 1 ? ([...words[words.length - 1]!][0] ?? '') : ''
  return (first + last).toUpperCase()
}

/**
 * A person: their picture, or their initials on a tone of their own.
 *
 * ```tsx
 * <Avatar name="Ada Lovelace" status="online" />
 * ```
 */
export function Avatar(props: AvatarProps) {
  const { src, name = '', alt, size = 'md', shape = 'square', tone, status, className, style, ...rest } = useDefaults('Avatar', props)
  const [failed, setFailed] = useState<string | null>(null)
  const px = typeof size === 'number' ? size : SIZES[size]
  const showImage = src != null && failed !== src
  const spoken = alt ?? name
  return (
    <span
      role={spoken ? 'img' : undefined}
      aria-label={spoken ? (status ? `${spoken} (${status})` : spoken) : undefined}
      aria-hidden={spoken ? undefined : true}
      {...rest}
      className={cx('mt-avatar', className)}
      style={{ '--_size': `${px}px`, '--_tone': toneColor(tone) ?? toneColor(toneForName(name)), ...style } as CSSProperties}
      data-shape={shape}
      data-size={typeof size === 'number' ? undefined : size}
      data-status={status}
    >
      {showImage ? (
        <img className="mt-avatar-image" src={src} alt="" draggable={false} onError={() => setFailed(src)} />
      ) : (
        <span className="mt-avatar-initials" aria-hidden>
          {initialsOf(name)}
        </span>
      )}
      {status && <span className="mt-avatar-status" aria-hidden />}
    </span>
  )
}
