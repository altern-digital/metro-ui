import { createContext, useContext, type ReactNode } from 'react'

/**
 * Elements ConfigProvider renders into its portal for imperative APIs
 * (`useDialog().confirm()`, `useToast()`). They register themselves on first
 * use, so an app that never toasts never ships the toast code.
 */
export interface Layers {
  set(key: string, node: ReactNode): void
  remove(key: string): void
}

export const LayersContext = createContext<Layers | null>(null)

export function useLayers(): Layers {
  const layers = useContext(LayersContext)
  if (!layers) throw new Error('metro-ui: useDialog() and useToast() need a <ConfigProvider> above them.')
  return layers
}
