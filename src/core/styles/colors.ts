// ─── CSS-variable theme strings ─────────────────────────────────────────────
// Light mode (default)

export const THEME_VARS_CSS = `
  --nt-bg:             #ffffff;
  --nt-fg:             #111111;
  --nt-fg2:            #6b7280;
  --nt-border:         rgba(0,0,0,0.08);
  --nt-shadow:         0 4px 6px -1px rgba(0,0,0,0.08), 0 10px 32px -4px rgba(0,0,0,0.10);
  --nt-close:          #9ca3af;
  --nt-close-hover:    #374151;
  --nt-action-bg:      rgba(0,0,0,0.04);
  --nt-action-border:  rgba(0,0,0,0.10);
`

// Dark mode — applied via `@media (prefers-color-scheme: dark)`
export const THEME_VARS_DARK_CSS = `
  --nt-bg:             #1c1c1f;
  --nt-fg:             #f4f4f5;
  --nt-fg2:            rgba(255,255,255,0.52);
  --nt-border:         rgba(255,255,255,0.09);
  --nt-shadow:         0 4px 6px -1px rgba(0,0,0,0.30), 0 10px 40px -4px rgba(0,0,0,0.50);
  --nt-close:          rgba(255,255,255,0.38);
  --nt-close-hover:    rgba(255,255,255,0.80);
  --nt-action-bg:      rgba(255,255,255,0.07);
  --nt-action-border:  rgba(255,255,255,0.13);
`
