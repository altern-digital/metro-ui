import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useConfig } from '../../../config/context'

export interface PortalProps {
  children?: ReactNode
  /** Render somewhere else. Default: the nearest ConfigProvider's overlay layer, so it wears that theme. */
  container?: HTMLElement | null
}

/**
 * Renders its children into the ConfigProvider's overlay layer. Before the
 * layer mounts (server render, first client render) it renders nothing,
 * which is what an overlay wants anyway. Outside any provider it falls back
 * to `document.body`.
 */
export function Portal({ children, container }: PortalProps) {
  const { portal } = useConfig()
  const target = container ?? portal ?? (typeof document === 'undefined' ? null : document.body)
  return target ? createPortal(children, target) : null
}
