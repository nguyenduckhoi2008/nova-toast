import { useSyncExternalStore, useCallback, useRef } from 'react'
import { toastStore } from '../core/store'
import type { ToastState, ToastStore } from '../core/types'

function buildStore(state: ToastState): ToastStore {
  return {
    ...state,
    add: toastStore.add,
    update: toastStore.update,
    remove: toastStore.remove,
    setConfig: toastStore.setConfig,
    setTypeConfig: toastStore.setTypeConfig
  }
}

export function useToastStore(): ToastStore
export function useToastStore<T>(selector: (state: ToastStore) => T): T
export function useToastStore<T>(selector?: (state: ToastStore) => T) {
  const cacheRef = useRef<{ state: ToastState; result: T } | null>(null)

  const getSnapshot = useCallback((): T => {
    const state = toastStore.getSnapshot()

    if (cacheRef.current && cacheRef.current.state === state) {
      return cacheRef.current.result
    }

    const store = buildStore(state)
    const result = selector ? selector(store) : (store as unknown as T)
    cacheRef.current = { state, result }
    return result
  }, [selector])

  return useSyncExternalStore(toastStore.subscribe, getSnapshot, getSnapshot)
}
