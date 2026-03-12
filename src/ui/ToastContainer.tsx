'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useToastStore } from './useStore'
import { toastStore } from '../core/store'
import { getPositionStyle } from '../core/styles/positions'
import { getKeyframes } from '../core/styles/animations'
import { THEME_VARS_CSS, THEME_VARS_DARK_CSS } from '../core/styles/colors'
import { ToastItem } from './ToastItem'
import type { ToastConfig } from '../core/types'

export interface ToastContainerProps extends Partial<ToastConfig> {}

let mountCount = 0

export function ToastContainer(props: ToastContainerProps) {
  const { toasts, config } = useToastStore()

  useEffect(() => {
    mountCount++
    if (mountCount > 1 && typeof console !== 'undefined') {
      console.warn(
        '[nova-toast] Multiple <ToastContainer> detected. Mount only one at app root.'
      )
    }
    return () => {
      mountCount--
    }
  }, [])

  const prevRef = useRef('')
  useEffect(() => {
    const incoming: Partial<ToastConfig> = {}
    if (props.position !== undefined) incoming.position = props.position
    if (props.duration !== undefined) incoming.duration = props.duration
    if (props.maxToasts !== undefined) incoming.maxToasts = props.maxToasts
    if (props.animation !== undefined) incoming.animation = props.animation
    if (props.pauseOnHover !== undefined) incoming.pauseOnHover = props.pauseOnHover
    if (props.showProgress !== undefined) incoming.showProgress = props.showProgress
    if (props.swipeToDismiss !== undefined) incoming.swipeToDismiss = props.swipeToDismiss
    if (props.theme !== undefined) incoming.theme = props.theme
    if (props.types !== undefined) incoming.types = props.types
    const key = JSON.stringify(incoming)
    if (key !== '{}' && key !== prevRef.current) {
      prevRef.current = key
      toastStore.setConfig(incoming)
    }
  }, [
    props.position,
    props.duration,
    props.maxToasts,
    props.animation,
    props.pauseOnHover,
    props.showProgress,
    props.swipeToDismiss,
    props.theme,
    props.types
  ])

  const handleRemove = useCallback((id: string) => toastStore.remove(id), [])
  const visible = toasts.slice(-config.maxToasts)

  const themeCSS =
    config.theme === 'dark'
      ? `.nova-toast-container { ${THEME_VARS_DARK_CSS} }`
      : config.theme === 'light'
        ? `.nova-toast-container { ${THEME_VARS_CSS} }`
        : `.nova-toast-container { ${THEME_VARS_CSS} }
           @media (prefers-color-scheme: dark) {
             .nova-toast-container { ${THEME_VARS_DARK_CSS} }
           }`

  return (
    <>
      <style>{`
        ${themeCSS}
        ${getKeyframes(config.animation, config.position)}
        @keyframes nova-toast-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes nova-toast-progress { from{width:100%} to{width:0%} }
        .nova-toast-close:hover { color: var(--nt-close-hover) !important; }
        @media(max-width:480px){
          .nova-toast-container {
            left:0!important; right:0!important;
            transform:none!important; max-width:100%!important;
            align-items:stretch!important; padding:0 10px!important;
          }
        }
      `}</style>
      <div className="nova-toast-container" style={getPositionStyle(config.position)}>
        {visible.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            duration={config.duration}
            config={config}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </>
  )
}
