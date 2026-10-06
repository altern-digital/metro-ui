/**
 * The only colour maths the library does in JavaScript: which of black or
 * white reads better on the accent. Shades of the accent are color-mix in CSS.
 */

/** `#rgb`, `#rgba`, `#rrggbb` or `#rrggbbaa` to 0–255 channels, or null for anything else. */
export function parseHex(color: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(color.trim())
  if (!m) return null
  let hex = m[1]!
  if (hex.length <= 4) hex = [...hex].map((c) => c + c).join('')
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
}

/** WCAG relative luminance. */
export function luminance([r, g, b]: [number, number, number]): number {
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function contrast(a: number, b: number): number {
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Text colour for a solid fill. Metro puts white on its accents even where
 * black would score higher (blue, orange), so white wins until it really
 * fades: under 2.2:1, which only lime, amber and pale custom accents reach.
 * Colours it can't parse get white.
 */
export function readableOn(color: string): '#fff' | '#000' {
  const rgb = parseHex(color)
  if (!rgb) return '#fff'
  return contrast(luminance(rgb), 1) < 2.2 ? '#000' : '#fff'
}
