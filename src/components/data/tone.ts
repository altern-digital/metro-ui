import type { CSSProperties } from 'react'
import { readableOn } from '../../config/color'
import { useConfig } from '../../config/context'
import { TONES, toneVar, type Tone } from '../../config/theme'

/**
 * A filled surface's colours as private custom properties (`--_fill`,
 * `--_on`): the tone as its token, and black or white on it. Without a tone
 * it is the accent. Colours that can't be read as hex get white text, as on
 * a Metro tile.
 */
export function useToneVars(tone: Tone | undefined): CSSProperties {
  const { theme } = useConfig()
  if (!tone) return {}
  const hex = theme.tones?.[tone] ?? (TONES as Record<string, string>)[tone] ?? tone
  return { '--_fill': toneVar(tone), '--_on': readableOn(hex) } as CSSProperties
}
