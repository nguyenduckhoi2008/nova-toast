import type { ToastAnimation, ToastPosition } from '../types'

export const ANIMATION_OUT_MS = 350

const VALID_ANIMATIONS = new Set<string>(['slide', 'fade', 'pop', 'bounce'])

// ─── Animation helpers ────────────────────────────────────────────────────────

export function getAnimationEasing(animation: ToastAnimation): string {
  return animation === 'bounce'
    ? 'cubic-bezier(0.34,1.56,0.64,1)'
    : 'cubic-bezier(0.16,1,0.3,1)'
}

export function getAnimationDuration(animation: ToastAnimation): number {
  return animation === 'bounce' ? 480 : 350
}

// ─── Keyframes ────────────────────────────────────────────────────────────────

export function getKeyframes(animation: ToastAnimation, position: ToastPosition): string {
  if (!VALID_ANIMATIONS.has(animation)) return ''

  const isBottom = position.startsWith('bottom')
  const isLeft   = position.endsWith('left')
  const isRight  = position.endsWith('right')

  switch (animation) {
    case 'slide': {
      const ty   = isBottom ? '12px' : '-12px'
      const tx   = isLeft ? '-20px' : isRight ? '20px' : '0'
      const from = isLeft || isRight
        ? `translate3d(${tx},0,0) scale(0.96)`
        : `translate3d(0,${ty},0) scale(0.96)`
      const to = 'translate3d(0,0,0) scale(1)'
      return `
        @keyframes nova-toast-in  { from{opacity:0;transform:${from}} to{opacity:1;transform:${to}} }
        @keyframes nova-toast-out { from{opacity:1;transform:${to}} to{opacity:0;transform:${from}} }
      `
    }

    case 'fade':
      return `
        @keyframes nova-toast-in  { from{opacity:0} to{opacity:1} }
        @keyframes nova-toast-out { from{opacity:1} to{opacity:0} }
      `

    case 'pop':
      return `
        @keyframes nova-toast-in  { from{opacity:0;transform:scale(.75)} 60%{transform:scale(1.04)} to{opacity:1;transform:scale(1)} }
        @keyframes nova-toast-out { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(.75)} }
      `

    case 'bounce': {
      // ── Why the old version lagged ─────────────────────────────────────────
      // 3 keyframe stops (0/60/100) = 2 interpolation segments per frame.
      // translateY() doesn't guarantee a GPU compositing layer → browser may
      // promote mid-animation, causing a visible stutter on frame 1.
      //
      // ── Fix ────────────────────────────────────────────────────────────────
      // • translate3d() forces an immediate GPU composite layer.
      // • Spring curve cubic-bezier(0.34,1.56,0.64,1) in getAnimationEasing()
      //   reproduces the overshoot organically — no extra stops needed.
      // • 2 stops only → single interpolation segment, fully on compositor
      //   thread, zero main-thread involvement after frame 1.
      const dir = isBottom ? '18px' : '-18px'
      return `
        @keyframes nova-toast-in  {
          from { opacity:0; transform:translate3d(0,${dir},0); }
          to   { opacity:1; transform:translate3d(0,0,0); }
        }
        @keyframes nova-toast-out {
          from { opacity:1; transform:translate3d(0,0,0); }
          to   { opacity:0; transform:translate3d(0,${dir},0); }
        }
      `
    }

    default:
      return ''
  }
}
