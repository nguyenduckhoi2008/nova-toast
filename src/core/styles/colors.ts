// ─── CSS-variable theme strings ─────────────────────────────────────────────
// Light mode (default)

export const THEME_VARS_CSS = `
  --nt-bg:             #ffffff;
  --nt-fg:             #0f172a;
  --nt-fg2:            #64748b;
  --nt-border:         rgba(15,23,42,0.08);
  --nt-shadow:         0 1px 2px rgba(15,23,42,0.04),
                       0 4px 8px -1px rgba(15,23,42,0.06),
                       0 12px 36px -8px rgba(15,23,42,0.14);
  --nt-close:          #94a3b8;
  --nt-close-hover:    #1e293b;
  --nt-action-bg:      rgba(15,23,42,0.04);
  --nt-action-border:  rgba(15,23,42,0.10);
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
