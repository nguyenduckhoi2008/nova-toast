import type { ToastPosition } from '../types'

const VALID_POSITIONS = new Set<string>([
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right'
])

// ─── CSSProperties version (for React renderer) ─────────────────────────────

const BASE_STYLE = {
  position: 'fixed' as const,
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 8,
  pointerEvents: 'none' as const,
  padding: '0 16px',
  width: '100%',
  maxWidth: 412
}

export function getPositionStyle(position: ToastPosition): Record<string, unknown> {
  if (!VALID_POSITIONS.has(position))
    return {
      ...BASE_STYLE,
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      alignItems: 'center'
    }

  switch (position) {
    case 'top-left':
      return { ...BASE_STYLE, top: 16, left: 16, alignItems: 'flex-start' }
    case 'top-center':
      return {
        ...BASE_STYLE,
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center'
      }
    case 'top-right':
      return { ...BASE_STYLE, top: 16, right: 16, alignItems: 'flex-end' }
    case 'bottom-left':
      return {
        ...BASE_STYLE,
        bottom: 16,
        left: 16,
        flexDirection: 'column-reverse' as const,
        alignItems: 'flex-start'
      }
    case 'bottom-center':
      return {
        ...BASE_STYLE,
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        flexDirection: 'column-reverse' as const,
        alignItems: 'center'
      }
    case 'bottom-right':
      return {
        ...BASE_STYLE,
        bottom: 16,
        right: 16,
        flexDirection: 'column-reverse' as const,
        alignItems: 'flex-end'
      }
    default:
      return {
        ...BASE_STYLE,
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center'
      }
  }
}
