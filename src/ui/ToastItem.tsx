'use client'

import { useEffect, useRef, useCallback, type ReactElement } from 'react'
import {
  ANIMATION_OUT_MS,
  getAnimationDuration,
  getAnimationEasing
} from '../core/styles/animations'
import { CloseButton } from './CloseButton'
import type { Toast, ToastConfig } from '../core/types'

export interface ToastItemProps {
  toast: Toast
  duration: number
  config: ToastConfig
  onRemove: (id: string) => void
}

// ─── Spinner ────────────────────────────────────────────────────────────────

function Spinner({ color }: { color: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: 'nova-toast-spin 0.8s linear infinite', display: 'block' }}
    >
      <circle cx="8" cy="8" r="6" stroke={color} strokeOpacity="0.25" strokeWidth="2.5" />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Default SVG icons ───────────────────────────────────────────────────────

const ICONS: Record<string, ReactElement> = {
  success: (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M2.343 13.657A8 8 0 1 1 13.657 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.75.75 0 0 0-1.06 1.06L6.94 8 4.97 9.97a.75.75 0 1 0 1.06 1.06L8 9.06l1.97 1.97a.75.75 0 1 0 1.06-1.06L9.06 8l1.97-1.97a.75.75 0 0 0-1.06-1.06L8 6.94 6.03 4.97Z" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575ZM8 5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5Zm1 6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" />
    </svg>
  )
}

const SWIPE_THRESHOLD = 80

// ─── ToastItem ───────────────────────────────────────────────────────────────

export function ToastItem({ toast, duration, config, onRemove }: ToastItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const remainingRef = useRef(0)
  const startTimeRef = useRef(0)
  const isDismissingRef = useRef(false)
  const isSwiping = useRef(false)
  const touchStartX = useRef(0)
  const swipeX = useRef(0)

  const typeConfig = config.types[toast.type]
  const accent = typeConfig.color
  const isLoading = toast.type === 'loading'
  const effectiveDuration = toast.duration ?? duration
  const shouldAutoDismiss = effectiveDuration > 0 && !isLoading
  const showProgress = config.showProgress && shouldAutoDismiss
  const canSwipe = config.swipeToDismiss
  const canPause = config.pauseOnHover
  const animDuration = getAnimationDuration(config.animation)
  const animEasing = getAnimationEasing(config.animation)

  // ── icon resolution ──────────────────────────────────────────────────────
  let icon: ReactElement | null = null
  if (toast.icon != null) {
    icon = toast.icon as ReactElement
  } else if (typeConfig.icon != null) {
    icon = typeConfig.icon as ReactElement
  } else if (isLoading) {
    icon = <Spinner color={accent} />
  } else {
    icon = ICONS[toast.type] ?? null
  }

  // ── timer ────────────────────────────────────────────────────────────────
  const animateOut = useCallback(() => {
    if (isDismissingRef.current) return
    isDismissingRef.current = true
    ref.current?.style.setProperty(
      'animation',
      `nova-toast-out ${ANIMATION_OUT_MS}ms ease forwards`
    )
    exitTimerRef.current = setTimeout(() => onRemove(toast.id), ANIMATION_OUT_MS)
  }, [onRemove, toast.id])

  const startTimer = useCallback(
    (ms: number) => {
      if (!shouldAutoDismiss) return
      remainingRef.current = ms
      startTimeRef.current = Date.now()
      timerRef.current = setTimeout(animateOut, ms)
    },
    [shouldAutoDismiss, animateOut]
  )

  const pauseTimer = useCallback(() => {
    if (!canPause) return
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    remainingRef.current = Math.max(
      remainingRef.current - (Date.now() - startTimeRef.current),
      0
    )
    if (progressRef.current) progressRef.current.style.animationPlayState = 'paused'
  }, [canPause])

  const resumeTimer = useCallback(() => {
    if (!canPause) return
    if (shouldAutoDismiss && remainingRef.current > 0) startTimer(remainingRef.current)
    if (progressRef.current) progressRef.current.style.animationPlayState = 'running'
  }, [canPause, shouldAutoDismiss, startTimer])

  useEffect(() => {
    startTimer(effectiveDuration)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [toast.id, effectiveDuration, startTimer])

  // restart timer + progress when loading → success/error
  useEffect(() => {
    if (toast.type !== 'loading' && effectiveDuration > 0) {
      if (timerRef.current) clearTimeout(timerRef.current)
      isDismissingRef.current = false
      remainingRef.current = effectiveDuration
      startTimeRef.current = Date.now()
      timerRef.current = setTimeout(animateOut, effectiveDuration)
      if (progressRef.current) {
        progressRef.current.style.animation = 'none'
        void progressRef.current.offsetWidth
        progressRef.current.style.animation = `nova-toast-progress ${effectiveDuration}ms linear forwards`
        progressRef.current.style.animationPlayState = 'running'
      }
    }
  }, [toast.type, effectiveDuration, animateOut])

  // ── swipe ────────────────────────────────────────────────────────────────
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!canSwipe) return
      touchStartX.current = e.touches[0].clientX
      swipeX.current = 0
      isSwiping.current = true
    },
    [canSwipe]
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!canSwipe || !isSwiping.current) return
      const dx = e.touches[0].clientX - touchStartX.current
      swipeX.current = dx
      if (ref.current) {
        ref.current.style.transform = `translateX(${dx}px)`
        ref.current.style.opacity = String(Math.max(1 - Math.abs(dx) / 200, 0.3))
        ref.current.style.transition = 'none'
      }
    },
    [canSwipe]
  )

  const onTouchEnd = useCallback(() => {
    if (!canSwipe || !isSwiping.current) return
    isSwiping.current = false
    const dx = swipeX.current
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      if (isDismissingRef.current) return
      isDismissingRef.current = true
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (ref.current) {
        ref.current.style.transition = 'transform 200ms ease, opacity 200ms ease'
        ref.current.style.transform = `translateX(${dx > 0 ? 400 : -400}px)`
        ref.current.style.opacity = '0'
      }
      exitTimerRef.current = setTimeout(() => onRemove(toast.id), 200)
    } else if (ref.current) {
      ref.current.style.transition = 'transform 200ms ease, opacity 200ms ease'
      ref.current.style.transform = 'translateX(0)'
      ref.current.style.opacity = '1'
    }
  }, [canSwipe, onRemove, toast.id])

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    animateOut()
  }

  // ── custom render ────────────────────────────────────────────────────────
  if (toast.render) {
    return (
      <div
        ref={ref}
        role="alert"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          pointerEvents: 'auto',
          animation: `nova-toast-in ${animDuration}ms ${animEasing}`,
          maxWidth: 400,
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {toast.render(toast, handleClose)}
      </div>
    )
  }

  // ── main render ──────────────────────────────────────────────────────────
  return (
    <div
      ref={ref}
      role="alert"
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={
        {
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          padding: '12px 12px 12px 16px',
          borderRadius: 16,
          backgroundColor: 'var(--nt-bg)',
          color: 'var(--nt-fg)',
          border: `1px solid var(--nt-border)`,
          boxShadow: `var(--nt-shadow), inset 0 0 0 1px ${accent}08`,
          fontSize: 14,
          lineHeight: 1.45,
          pointerEvents: 'auto',
          maxWidth: 400,
          width: '100%',
          boxSizing: 'border-box',
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden',
          animation: `nova-toast-in ${animDuration}ms ${animEasing}`,
          fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
          touchAction: canSwipe ? 'pan-y' : 'auto'
        } as React.CSSProperties
      }
    >
      {/* Accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 3,
          height: '100%',
          background: `linear-gradient(to bottom, ${accent}, ${accent}60)`,
          borderRadius: '16px 0 0 16px'
        }}
      />
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title row — icon inline before title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              backgroundColor: `${accent}14`,
              color: accent
            }}
          >
            {icon}
          </div>
          <p
            style={{ margin: 0, fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}
          >
            {toast.message}
          </p>
        </div>

        {/* Description */}
        {toast.description && (
          <p
            style={{
              margin: '5px 0 0 33px',
              fontSize: 13,
              color: 'var(--nt-fg2)',
              lineHeight: 1.45
            }}
          >
            {toast.description}
          </p>
        )}

        {/* Action button */}
        {toast.action && (
          <div style={{ marginTop: 8, marginLeft: 33 }}>
            <button
              onClick={() => {
                toast.action?.onClick()
                handleClose()
              }}
              style={{
                background: `${accent}15`,
                color: accent,
                border: `1px solid ${accent}30`,
                borderRadius: 8,
                padding: '4px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                lineHeight: 'normal',
                fontFamily: 'inherit'
              }}
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>

      {/* Close */}
      {!isLoading && <CloseButton onClick={handleClose} />}

      {/* Progress bar */}
      {showProgress && (
        <div
          ref={progressRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(to right, ${accent}, ${accent}80)`,
            animation: `nova-toast-progress ${effectiveDuration}ms linear forwards`
          }}
        />
      )}
    </div>
  )
}
