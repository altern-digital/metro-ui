// The library's own hooks.
export { useAdaptive } from './useAdaptive'
export { installPressTracking, isTap, type Press } from './press'
export { useConfig, usePlatform, useBreakpoint, useLocale, useIsMobile } from '../config/context'
export { useTween } from '../motion/tween'

// A curated set from @mantine/hooks (the library already depends on it), so apps need no second hooks package.
export {
  useClickOutside,
  useClipboard,
  useDebouncedCallback,
  useDebouncedValue,
  useDisclosure,
  useDocumentTitle,
  useElementSize,
  useFocusTrap,
  useHotkeys,
  useIntersection,
  useInterval,
  useLocalStorage,
  useMediaQuery,
  useMergedRef,
  useMounted,
  useNetwork,
  useReducedMotion,
  useResizeObserver,
  useTimeout,
  useToggle,
  useUncontrolled,
  useViewportSize,
  useWindowScroll,
} from '@mantine/hooks'
