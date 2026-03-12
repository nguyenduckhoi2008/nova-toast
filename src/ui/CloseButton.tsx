'use client'

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      style={{
        background: 'transparent',
        border: 'none',
        color: 'var(--nt-close)',
        cursor: 'pointer',
        padding: 4,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        lineHeight: 1,
        transition: 'color 0.15s ease'
        // hover handled by CSS class (see ToastContainer style injection)
      }}
      className="nova-toast-close"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        <path d="M2 2l10 10M12 2L2 12" />
      </svg>
    </button>
  )
}
