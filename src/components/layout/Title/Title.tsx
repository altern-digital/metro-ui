import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'

export type TitleLevel = 1 | 2 | 3 | 4

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * - `1`: the page title, 42px weight 200.
   * - `2`: 34px weight 200.
   * - `3`: 24px weight 300.
   * - `4`: 18px weight 600.
   */
  level?: TitleLevel
  /** The element to render. Default `h1`…`h4` by level. */
  as?: ElementType
  /** Keep the text's case. By default Metro titles are lowercased. */
  keepCase?: boolean
  ref?: Ref<HTMLHeadingElement>
  children?: ReactNode
}

/**
 * A Metro heading: big, light and lowercase.
 *
 * ```tsx
 * <Title>settings</Title>
 * <Title level={3}>accounts</Title>
 * ```
 */
export function Title(props: TitleProps) {
  const { level = 1, as, keepCase, className, ...rest } = useDefaults('Title', props)
  const As: ElementType = as ?? `h${level}`
  return <As {...rest} className={cx('mt-title', className)} data-level={level} data-keep-case={flag(keepCase)} />
}

export interface SubtitleProps extends HTMLAttributes<HTMLParagraphElement> {
  /** The element to render. Default `p`. */
  as?: ElementType
  ref?: Ref<HTMLParagraphElement>
  children?: ReactNode
}

/** The line under a title: 18px, light, muted. Not lowercased: it often carries names and messages. */
export function Subtitle(props: SubtitleProps) {
  const { as: As = 'p', className, ...rest } = useDefaults('Subtitle', props)
  return <As {...rest} className={cx('mt-subtitle', className)} />
}
