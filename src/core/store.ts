import type { ToastConfig, ToastInput, ToastState, ToastStore } from './types'

// ─── Default Config ─────────────────────────────────────────────────────────

const DEFAULT_CONFIG: ToastConfig = {
  position: 'top-center',
  duration: 4000,
  maxToasts: 3,
  animation: 'bounce',
  theme: 'auto',
  pauseOnHover: true,
  showProgress: true,
  swipeToDismiss: true,
  types: {
    success: { icon: null, color: '#22c55e' },
    error: { icon: null, color: '#ef4444' },
    info: { icon: null, color: '#3b82f6' },
    warning: { icon: null, color: '#f59e0b' },
    loading: { icon: null, color: '#8b8b8b' }
  }
}

// ─── Store ─────────────────────────────────────────────────────────────────

type Listener = () => void

let state: ToastState = {
  toasts: [],
  config: DEFAULT_CONFIG
}

let counter = 0
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((l) => l())
}

function setState(partial: Partial<ToastState>) {
  state = { ...state, ...partial }
  emit()
}

// ─── Actions ────────────────────────────────────────────────────────────────

function add(input: ToastInput): string {
  const id = String(++counter)
  const { config } = state
  const toasts = [...state.toasts, { ...input, id }].slice(-config.maxToasts)
  setState({ toasts })
  return id
}

function remove(id: string) {
  setState({ toasts: state.toasts.filter((t) => t.id !== id) })
}

function update(id: string, partial: Partial<ToastInput>) {
  setState({
    toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...partial } : t))
  })
}

function setConfig(partial: Partial<ToastConfig>) {
  const newConfig = { ...state.config, ...partial }
  const updated: Partial<ToastState> = { config: newConfig }

  if (partial.maxToasts !== undefined && state.toasts.length > newConfig.maxToasts) {
    updated.toasts = state.toasts.slice(-newConfig.maxToasts)
  }

  setState(updated)
}

function setTypeConfig(
  type: keyof ToastConfig['types'],
  partial: Partial<ToastConfig['types'][typeof type]>
) {
  setConfig({
    types: {
      ...state.config.types,
      [type]: { ...state.config.types[type], ...partial }
    }
  })
}

// ─── Public API ─────────────────────────────────────────────────────────────

export const toastStore = {
  getState: (): ToastStore => ({
    ...state,
    add,
    update,
    remove,
    setConfig,
    setTypeConfig
  }),

  getSnapshot: (): ToastState => state,

  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  add,
  update,
  remove,
  setConfig,
  setTypeConfig
}
