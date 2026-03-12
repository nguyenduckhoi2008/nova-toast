// ─── Toast Types ────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type ToastAnimation = 'slide' | 'fade' | 'pop' | 'bounce'

export type ToastTheme = 'light' | 'dark' | 'auto'

// ─── Action Button ──────────────────────────────────────────────────────────

export interface ToastAction {
  label: string
  onClick: () => void
}

// ─── Custom Render ──────────────────────────────────────────────────────────
// Generic — React entry narrows to ReactNode, Vanilla entry narrows to HTMLElement

export type ToastRenderFn<R = unknown> = (toast: Toast, dismiss: () => void) => R

// ─── Toast Data ─────────────────────────────────────────────────────────────

export interface Toast {
  id: string
  type: ToastType
  message: string
  description?: string
  icon?: unknown
  duration?: number
  action?: ToastAction
  render?: ToastRenderFn<any>
}

export type ToastInput = Omit<Toast, 'id'>

// ─── Config ─────────────────────────────────────────────────────────────────

export interface ToastTypeConfig {
  icon: unknown
  color: string
}

export interface ToastConfig {
  position: ToastPosition
  duration: number
  maxToasts: number
  animation: ToastAnimation
  theme: ToastTheme
  pauseOnHover: boolean
  showProgress: boolean
  swipeToDismiss: boolean
  types: Record<ToastType, ToastTypeConfig>
}

// ─── Store ──────────────────────────────────────────────────────────────────

export interface ToastState {
  toasts: Toast[]
  config: ToastConfig
}

export interface ToastActions {
  add: (toast: ToastInput) => string
  update: (id: string, toast: Partial<ToastInput>) => void
  remove: (id: string) => void
  setConfig: (config: Partial<ToastConfig>) => void
  setTypeConfig: (type: ToastType, config: Partial<ToastTypeConfig>) => void
}

export type ToastStore = ToastState & ToastActions
