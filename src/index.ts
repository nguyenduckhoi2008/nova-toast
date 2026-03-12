// ─── Core (shared) ──────────────────────────────────────────────────────────
export { toast } from './core/toast'
export { toastStore } from './core/store'
export type { ToastOptions, PromiseMessages, LoadingToastHandle } from './core/toast'

// ─── React-specific ─────────────────────────────────────────────────────────
export { useToastStore } from './ui/useStore'
export { ToastContainer } from './ui/ToastContainer'
export type { ToastContainerProps } from './ui/ToastContainer'
export { ToastItem } from './ui/ToastItem'
export type { ToastItemProps } from './ui/ToastItem'
export { CloseButton } from './ui/CloseButton'

// ─── Types ──────────────────────────────────────────────────────────────────
export type {
  Toast,
  ToastInput,
  ToastType,
  ToastPosition,
  ToastAnimation,
  ToastTheme,
  ToastAction,
  ToastRenderFn,
  ToastConfig,
  ToastTypeConfig,
  ToastState,
  ToastActions,
  ToastStore
} from './core/types'
