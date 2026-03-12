import { toastStore } from './store'
import type { ToastAction, ToastInput, ToastType } from './types'

// ─── Options ────────────────────────────────────────────────────────────────

export interface ToastOptions {
  description?: string
  icon?: unknown
  duration?: number
  action?: ToastAction
  render?: (toast: any, dismiss: () => void) => any
}

export interface LoadingToastHandle {
  id: string
  dismiss: () => void
  update: (partial: Partial<Omit<ToastInput, 'type'>> & { type?: ToastType }) => void
  success: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
}

export interface PromiseMessages<T> {
  loading: string | (ToastOptions & { message: string })
  success:
    | string
    | ((data: T) => string)
    | (ToastOptions & { message: string | ((data: T) => string) })
  error:
    | string
    | ((err: unknown) => string)
    | (ToastOptions & { message: string | ((err: unknown) => string) })
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fire(
  type: ToastType,
  message: string,
  optionsOrDesc?: string | ToastOptions
): string {
  const opts: ToastOptions =
    typeof optionsOrDesc === 'string'
      ? { description: optionsOrDesc }
      : (optionsOrDesc ?? {})

  return toastStore.add({
    type,
    message,
    description: opts.description,
    icon: opts.icon,
    duration: opts.duration,
    action: opts.action,
    render: opts.render
  })
}

function resolveMessage<T>(
  value:
    | string
    | ((arg: T) => string)
    | (ToastOptions & { message: string | ((arg: T) => string) }),
  arg: T
): { message: string } & ToastOptions {
  if (typeof value === 'string') {
    return { message: value }
  }
  if (typeof value === 'function') {
    return { message: value(arg) }
  }
  const msg = typeof value.message === 'function' ? value.message(arg) : value.message
  return { ...value, message: msg }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export const toast = {
  success: (message: string, options?: string | ToastOptions) =>
    fire('success', message, options),
  error: (message: string, options?: string | ToastOptions) =>
    fire('error', message, options),
  info: (message: string, options?: string | ToastOptions) =>
    fire('info', message, options),
  warning: (message: string, options?: string | ToastOptions) =>
    fire('warning', message, options),

  loading: (message: string, options?: string | ToastOptions): LoadingToastHandle => {
    const id = fire('loading', message, options)
    return {
      id,
      dismiss: () => toastStore.remove(id),
      update: (partial) => toastStore.update(id, partial),
      success: (msg, opts) => {
        const o: ToastOptions =
          typeof opts === 'string' ? { description: opts } : (opts ?? {})
        toastStore.update(id, { type: 'success', message: msg, ...o })
      },
      error: (msg, opts) => {
        const o: ToastOptions =
          typeof opts === 'string' ? { description: opts } : (opts ?? {})
        toastStore.update(id, { type: 'error', message: msg, ...o })
      }
    }
  },

  custom: (
    render: (toast: any, dismiss: () => void) => any,
    options?: { duration?: number }
  ): string => {
    return toastStore.add({
      type: 'info',
      message: '',
      render,
      duration: options?.duration
    })
  },

  dismiss: (id: string) => toastStore.remove(id),

  promise: <T>(promise: Promise<T>, messages: PromiseMessages<T>): Promise<T> => {
    const loadingMsg =
      typeof messages.loading === 'string'
        ? { message: messages.loading }
        : messages.loading
    const id = toastStore.add({
      type: 'loading',
      message: loadingMsg.message as string,
      description: 'description' in loadingMsg ? loadingMsg.description : undefined,
      icon: 'icon' in loadingMsg ? loadingMsg.icon : undefined,
      duration: 0
    })

    promise.then(
      (data) => {
        const resolved = resolveMessage(messages.success, data)
        toastStore.update(id, {
          type: 'success',
          message: resolved.message,
          description: resolved.description,
          icon: resolved.icon,
          duration: resolved.duration
        })
      },
      (err) => {
        const resolved = resolveMessage(messages.error, err)
        toastStore.update(id, {
          type: 'error',
          message: resolved.message,
          description: resolved.description,
          icon: resolved.icon,
          duration: resolved.duration
        })
      }
    )

    return promise
  }
}
