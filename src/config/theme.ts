/** The 13 Metro tones. Keep in step with the --mt-tone-* tokens in styles/tokens.css. */
export const TONES = {
  slate: '#647687',
  gray: '#8a8a8a',
  blue: '#1ba1e2',
  cyan: '#00b7c3',
  teal: '#00aba9',
  green: '#60a917',
  lime: '#a4c400',
  amber: '#f0a30a',
  orange: '#fa6800',
  red: '#e51400',
  pink: '#d80073',
  purple: '#aa00ff',
  indigo: '#6a00ff',
} as const

export type ToneName = keyof typeof TONES
/** A Metro tone by name, a tone added through `theme.tones`, or any CSS colour. */
export type Tone = ToneName | (string & {})

export type ThemeMode = 'dark' | 'light' | 'system'
export type Density = 'auto' | 'compact' | 'comfortable' | 'touch'
export type PlatformSetting = 'auto' | 'mobile' | 'desktop'
export type Platform = 'mobile' | 'desktop'
export type MotionSetting = 'auto' | 'full' | 'reduced' | 'none'

export interface ThemeConfig {
  /** Default `dark`, as on Windows Phone. `system` follows the OS. */
  mode?: ThemeMode
  /** A tone name (`teal`), a tone from `tones`, or any CSS colour (`#ff6600`). */
  accent?: Tone
  /** Tones to add or override, usable by name for tiles and the accent. */
  tones?: Record<string, string>
  /** Escape hatch: set any token, e.g. `{ '--mt-font': 'Inter, sans-serif' }`. */
  tokens?: Record<`--mt-${string}`, string | number>
}

/** Words the components say on their own. Lowercase, as Metro writes its chrome. */
export interface Locale {
  ok: string
  cancel: string
  close: string
  clear: string
  search: string
  more: string
  back: string
  menu: string
  loading: string
  empty: string
  error: string
  retry: string
  showPassword: string
  hidePassword: string
  previous: string
  next: string
  page: string
  refresh: string
  pullToRefresh: string
  releaseToRefresh: string
  noOptions: string
  select: string
  remove: string
  resizePane: string
  on: string
  off: string
  day: string
  month: string
  year: string
  hour: string
  minute: string
  am: string
  pm: string
  breadcrumb: string
  pagination: string
  jumpTo: string
  notifications: string
}

export const DEFAULT_LOCALE: Locale = {
  ok: 'ok',
  cancel: 'cancel',
  close: 'close',
  clear: 'clear',
  search: 'search',
  more: 'more',
  back: 'back',
  menu: 'menu',
  loading: 'loading…',
  empty: 'nothing here yet',
  error: 'something went wrong',
  retry: 'try again',
  showPassword: 'show password',
  hidePassword: 'hide password',
  previous: 'previous',
  next: 'next',
  page: 'page',
  refresh: 'refresh',
  pullToRefresh: 'pull to refresh',
  releaseToRefresh: 'release to refresh',
  noOptions: 'no options',
  select: 'select…',
  remove: 'remove',
  resizePane: 'resize pane',
  on: 'on',
  off: 'off',
  day: 'day',
  month: 'month',
  year: 'year',
  hour: 'hour',
  minute: 'minute',
  am: 'am',
  pm: 'pm',
  breadcrumb: 'breadcrumb',
  pagination: 'pagination',
  jumpTo: 'jump to',
  notifications: 'notifications',
}

/** A ready-made Indonesian locale. */
export const LOCALE_ID: Locale = {
  ok: 'ok',
  cancel: 'batal',
  close: 'tutup',
  clear: 'hapus',
  search: 'cari',
  more: 'lainnya',
  back: 'kembali',
  menu: 'menu',
  loading: 'memuat…',
  empty: 'belum ada apa-apa',
  error: 'terjadi kesalahan',
  retry: 'coba lagi',
  showPassword: 'tampilkan kata sandi',
  hidePassword: 'sembunyikan kata sandi',
  previous: 'sebelumnya',
  next: 'berikutnya',
  page: 'halaman',
  refresh: 'muat ulang',
  pullToRefresh: 'tarik untuk memuat ulang',
  releaseToRefresh: 'lepas untuk memuat ulang',
  noOptions: 'tidak ada pilihan',
  select: 'pilih…',
  remove: 'hapus',
  resizePane: 'ubah ukuran panel',
  on: 'aktif',
  off: 'nonaktif',
  day: 'hari',
  month: 'bulan',
  year: 'tahun',
  hour: 'jam',
  minute: 'menit',
  am: 'am',
  pm: 'pm',
  breadcrumb: 'jejak navigasi',
  pagination: 'halaman',
  jumpTo: 'lompat ke',
  notifications: 'notifikasi',
}

/** A colour for a tone: Metro and custom tones become their token, anything else passes through. */
export function toneVar(tone: Tone | undefined): string | undefined {
  if (!tone) return undefined
  return /^[a-z][a-z0-9-]*$/.test(tone) && !CSS_KEYWORDS.has(tone) ? `var(--mt-tone-${tone})` : tone
}

/** Colour keywords that look like tone names but must reach CSS as themselves. */
const CSS_KEYWORDS = new Set(['transparent', 'currentcolor', 'inherit', 'black', 'white'])
