<p align="center">
  <img src="https://img.shields.io/npm/v/@nguyenkhoidev208/nova-toast?color=%234ade80&label=version" alt="npm version" />
  <img src="https://img.shields.io/bundlephobia/minzip/@nguyenkhoidev208/nova-toast?color=%2360a5fa&label=size" alt="bundle size" />
  <img src="https://img.shields.io/npm/l/@nguyenkhoidev208/nova-toast?color=%23fbbf24" alt="license" />
  <img src="https://img.shields.io/npm/dt/@nguyenkhoidev208/nova-toast?color=%23a78bfa&label=downloads" alt="downloads" />
</p>

<h1 align="center">Nova Toast</h1>

<p align="center">
  Lightweight, animated toast notifications for modern frameworks.<br/>
  <strong>Zero dependencies</strong> — works with React, Next.js, Vue, Nuxt, and any framework with npm import support.
</p>

---

## Table of Contents

- [Highlights](#highlights)
- [Install](#install)
- [Quick Start](#quick-start)
- [Next.js App Router](#nextjs-app-router)
- **Features**
  - [Toast Types](#toast-types)
  - [Theme / Dark Mode](#theme)
  - [Description](#description)
  - [Progress Bar](#progress-bar)
  - [Swipe to Dismiss](#swipe-to-dismiss)
  - [Custom Render](#custom-render)
  - [Action Button](#action-button)
  - [Loading Toast](#loading-toast)
  - [Promise Toast](#promise-toast)
  - [Pause on Hover](#pause-on-hover)
  - [Custom Icons](#custom-icons)
  - [Per-Toast Options](#per-toast-options)
- [Configuration](#configuration)
- [Dismiss Programmatically](#dismiss-programmatically)
- [API Reference](#api-reference)
- [TypeScript](#typescript)
- [Project Structure](#project-structure)
- [License](#license)

---

<a id="highlights"></a>

## Highlights

- **Zero dependencies** — no Zustand, no Tailwind, no CSS imports
- **Framework support** — React, Next.js, Vue, Nuxt, and any framework with npm/import
- **5 toast types** — `success` `error` `info` `warning` `loading`
- **4 animations** — `slide` `fade` `pop` `bounce` (default: `bounce`)
- **6 positions** — all corners + top/bottom center
- **Promise toast** — `toast.promise()` auto-transitions loading → success/error
- **Loading toast** — `toast.loading()` returns handle with `.success()`, `.error()`, `.dismiss()`
- **Action button** — add interactive buttons (Undo, Retry, View...) inside toasts
- **Progress bar** — visual countdown timer on each toast
- **Swipe to dismiss** — swipe left/right on touch devices
- **Custom render** — `toast.custom()` for fully custom toast UI
- **Pause on hover** — hover to pause auto-dismiss
- **Auto dark mode** — adapts to `prefers-color-scheme`, or force `'light'` / `'dark'` via config
- **Mobile responsive** — auto centers on screens <= 480px
- **TypeScript** — fully typed, all types exported
- **Tiny** — ~15 KB minified

---

## Demo

https://github.com/user-attachments/assets/60a74df9-c1aa-40d0-a5c2-0e2a5063ae30

---

<a id="install"></a>

## Install

```bash
npm install @nguyenkhoidev208/nova-toast
```

```bash
yarn add @nguyenkhoidev208/nova-toast
```

```bash
pnpm add @nguyenkhoidev208/nova-toast
```

> **Peer dependencies:** `react >= 18`, `react-dom >= 18`

---

<a id="quick-start"></a>

## Quick Start

### 1. Mount the container once (at your app root)

```tsx
import { ToastContainer } from '@nguyenkhoidev208/nova-toast'

export default function App() {
  return (
    <>
      {/* your app */}
      <ToastContainer />
    </>
  )
}
```

With config:

```tsx
<ToastContainer
  position="bottom-right"
  duration={5000}
  maxToasts={5}
  animation="bounce"
  pauseOnHover={true}
  showProgress={true}
  swipeToDismiss={true}
/>
```

### 2. Fire toasts from anywhere

```tsx
import { toast } from '@nguyenkhoidev208/nova-toast'

toast.success('Saved!')
toast.error('Something went wrong')
toast.info('Tip', 'You can also add a description')
toast.warning('Careful!')
```

No providers, no context, no wrappers. Works in event handlers, async functions, utils — anywhere.

---

<a id="nextjs-app-router"></a>

## Next.js App Router

Nova Toast components are marked `'use client'` internally, so you can import them directly:

```tsx
// app/providers.tsx
'use client'
import { ToastContainer } from '@nguyenkhoidev208/nova-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer position="top-center" />
    </>
  )
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

Then fire toasts from any client component:

```tsx
'use client'
import { toast } from '@nguyenkhoidev208/nova-toast'

export function SaveButton() {
  return <button onClick={() => toast.success('Saved!')}>Save</button>
}
```

> Only call `toast.*()` from client-side code. The store is a module-level singleton — calling it during SSR may leak state across requests.

---

<a id="toast-types"></a>

## Toast Types

5 built-in types, each with its own icon and accent color:

```tsx
toast.success('File uploaded') // green
toast.error('Something went wrong') // red
toast.info('New update available') // blue
toast.warning('Storage almost full') // amber
toast.loading('Uploading...') // gray, no auto-dismiss
```

---

<a id="theme"></a>

## Theme / Dark Mode

Nova Toast supports 3 theme modes:

| Value     | Behavior                                                              |
| --------- | --------------------------------------------------------------------- |
| `'auto'`  | Follows the user's OS preference via `prefers-color-scheme` (default) |
| `'light'` | Always light mode, ignores OS preference                              |
| `'dark'`  | Always dark mode, ignores OS preference                               |

### Via props

```tsx
<ToastContainer theme="dark" />
```

### Via store (runtime toggle)

```tsx
import { toastStore } from '@nguyenkhoidev208/nova-toast'

// Sync with your app's theme
toastStore.setConfig({ theme: 'dark' })
```

### With next-themes

```tsx
'use client'
import { useTheme } from 'next-themes'
import { ToastContainer } from '@nguyenkhoidev208/nova-toast'
import type { ToastTheme } from '@nguyenkhoidev208/nova-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  return (
    <>
      {children}
      <ToastContainer theme={(resolvedTheme as ToastTheme) ?? 'auto'} />
    </>
  )
}
```

---

<a id="description"></a>

## Description

Add a secondary description below the title:

```tsx
// String shorthand — second argument is description
toast.success('Uploaded', 'File saved to cloud')

// Options object
toast.success('Uploaded', { description: 'File saved to cloud' })
```

---

<a id="progress-bar"></a>

## Progress Bar

Each toast shows a visual countdown bar that shrinks to zero as the toast is about to dismiss.

- Automatically pauses when hover pauses the timer
- Uses the toast's accent color
- Hidden on loading toasts (since they have no auto-dismiss)

Enabled by default. Disable it:

```tsx
<ToastContainer showProgress={false} />
```

---

<a id="swipe-to-dismiss"></a>

## Swipe to Dismiss

On touch devices, swipe left or right to dismiss a toast:

- Swipe past the threshold (80px) to dismiss
- Opacity fades as you swipe
- Snaps back if you don't swipe far enough

Enabled by default. Disable it:

```tsx
<ToastContainer swipeToDismiss={false} />
```

---

<a id="custom-render"></a>

## Custom Render

Render a completely custom toast UI — you control every pixel:

```tsx
import { toast } from '@nguyenkhoidev208/nova-toast'

toast.custom((t, dismiss) => (
  <div
    style={{
      background: '#1a1a2e',
      padding: 16,
      borderRadius: 12,
      color: '#fff',
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }}
  >
    <strong>New message</strong>
    <button onClick={dismiss}>Close</button>
  </div>
))

// With custom duration
toast.custom((t, dismiss) => <MyCustomToast onClose={dismiss} />, { duration: 8000 })
```

---

<a id="action-button"></a>

## Action Button

Add interactive buttons inside toasts — perfect for Undo, Retry, View actions:

```tsx
toast.success('Email archived', {
  action: { label: 'Undo', onClick: () => restoreEmail() }
})

toast.error('Upload failed', {
  action: { label: 'Retry', onClick: () => uploadFile() }
})

toast.info('New comment on your post', {
  action: { label: 'View', onClick: () => navigate('/comments') }
})
```

The action button automatically uses the toast's accent color. Clicking the button fires `onClick` and dismisses the toast.

---

<a id="loading-toast"></a>

## Loading Toast

`toast.loading()` returns a handle object so you can update or dismiss it later:

```tsx
const loader = toast.loading('Saving...')

try {
  await saveData()
  loader.success('Saved!')
} catch (err) {
  loader.error('Failed to save')
}

// Update the message midway
loader.update({ message: 'Almost done...' })

// Or just dismiss it
loader.dismiss()
```

### Handle API

| Method                              | Description             |
| ----------------------------------- | ----------------------- |
| `loader.id`                         | The toast ID            |
| `loader.success(message, options?)` | Update to success type  |
| `loader.error(message, options?)`   | Update to error type    |
| `loader.update(partial)`            | Update any toast fields |
| `loader.dismiss()`                  | Remove the toast        |

---

<a id="promise-toast"></a>

## Promise Toast

Track async operations — automatically transitions from loading → success or error:

```tsx
// Basic
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved successfully!',
  error: 'Failed to save'
})

// Dynamic messages based on result
toast.promise(uploadFile(file), {
  loading: 'Uploading...',
  success: (data) => `Uploaded ${data.filename}`,
  error: (err) => `Upload failed: ${err.message}`
})

// With full options (description, icon, duration)
toast.promise(fetchUsers(), {
  loading: { message: 'Loading users...', description: 'Please wait' },
  success: { message: 'Users loaded', description: '42 users found', duration: 3000 },
  error: { message: 'Failed', description: 'Check your connection' }
})

// Returns the original promise — use with await
const users = await toast.promise(fetchUsers(), {
  loading: 'Loading...',
  success: 'Done!',
  error: 'Failed'
})
```

---

<a id="pause-on-hover"></a>

## Pause on Hover

Toasts automatically pause their dismiss timer when you hover:

- **Mouse enters** → timer pauses, progress bar pauses
- **Mouse leaves** → timer resumes from where it left off

Enabled by default. Disable it:

```tsx
<ToastContainer pauseOnHover={false} />
```

---

<a id="custom-icons"></a>

## Custom Icons

### Per-toast icon

Pass any React element as an icon:

```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

toast.success('Deployed!', { icon: <FontAwesomeIcon icon={faCheck} /> })
toast.warning('Watch out', { icon: <AlertTriangle size={16} /> })
```

### Override default icons globally

```tsx
import { toastStore } from '@nguyenkhoidev208/nova-toast'
import { CheckCircle, XCircle } from 'lucide-react'

toastStore.setTypeConfig('success', { icon: <CheckCircle size={16} />, color: '#22c55e' })
toastStore.setTypeConfig('error', { icon: <XCircle size={16} />, color: '#dc2626' })
```

---

<a id="per-toast-options"></a>

## Per-Toast Options

The second argument can be a string (description shorthand) or an options object:

```tsx
// String shorthand — just a description
toast.success('Uploaded', 'File saved to cloud')

// Options object — full control
toast.success('Uploaded', {
  description: 'File saved to cloud',
  icon: <CloudIcon />,
  duration: 8000,
  action: { label: 'View', onClick: () => openFile() }
})
```

| Option        | Type                                     | Description                     |
| ------------- | ---------------------------------------- | ------------------------------- |
| `description` | `string`                                 | Secondary text below the title  |
| `icon`        | `ReactNode`                              | Override icon for this toast    |
| `duration`    | `number`                                 | Override auto-dismiss time (ms) |
| `action`      | `{ label: string, onClick: () => void }` | Action button inside the toast  |
| `render`      | `(toast, dismiss) => ReactNode`          | Fully custom toast UI           |

---

<a id="configuration"></a>

## Configuration

Pass props to `<ToastContainer>`:

```tsx
<ToastContainer
  position="top-right"
  duration={3000}
  maxToasts={4}
  animation="pop"
  pauseOnHover={true}
  showProgress={true}
  swipeToDismiss={true}
/>
```

Or update at runtime via store:

```tsx
import { toastStore } from '@nguyenkhoidev208/nova-toast'

toastStore.setConfig({ position: 'bottom-center', animation: 'slide' })
```

Or with the React hook:

```tsx
import { useToastStore } from '@nguyenkhoidev208/nova-toast'

const { setConfig } = useToastStore()
setConfig({ position: 'bottom-center' })
```

### Defaults

| Option           | Default        | Values                                                                                       |
| ---------------- | -------------- | -------------------------------------------------------------------------------------------- |
| `position`       | `'top-center'` | `'top-left'` `'top-center'` `'top-right'` `'bottom-left'` `'bottom-center'` `'bottom-right'` |
| `duration`       | `4000`         | any number (ms). Set `0` to disable auto-dismiss                                             |
| `maxToasts`      | `3`            | any number                                                                                   |
| `animation`      | `'bounce'`     | `'slide'` `'fade'` `'pop'` `'bounce'`                                                        |
| `theme`          | `'auto'`       | `'light'` `'dark'` `'auto'`                                                                  |
| `pauseOnHover`   | `true`         | `true` `false`                                                                               |
| `showProgress`   | `true`         | `true` `false`                                                                               |
| `swipeToDismiss` | `true`         | `true` `false`                                                                               |

### Default Colors

| Type      | Color     |
| --------- | --------- |
| `success` | `#22c55e` |
| `error`   | `#ef4444` |
| `info`    | `#3b82f6` |
| `warning` | `#f59e0b` |
| `loading` | `#8b8b8b` |

---

<a id="dismiss-programmatically"></a>

## Dismiss Programmatically

```tsx
const id = toast.success('Processing...')

// Later...
toast.dismiss(id)
```

---

<a id="api-reference"></a>

## API Reference

### `toast`

Shorthand API — works anywhere, no hooks needed.

```ts
toast.success(message, options?)  // => toast id (string)
toast.error(message, options?)    // => toast id
toast.info(message, options?)     // => toast id
toast.warning(message, options?)  // => toast id
toast.loading(message, options?)  // => LoadingToastHandle
toast.custom(render, options?)    // => toast id
toast.dismiss(id)                 // remove by id
toast.promise(promise, messages)  // => promise (pass-through)
```

### `LoadingToastHandle`

Returned by `toast.loading()`:

```ts
handle.id                        // toast id
handle.success(message, options?) // transition to success
handle.error(message, options?)   // transition to error
handle.update(partial)            // update any fields
handle.dismiss()                  // remove the toast
```

### `toastStore`

Low-level store — for advanced usage:

```ts
toastStore.add(input) // add a toast
toastStore.update(id, partial) // update an existing toast
toastStore.remove(id) // remove by id
toastStore.setConfig(partial) // merge config
toastStore.setTypeConfig(type, partial) // update icon/color per type
toastStore.getState() // get current state
toastStore.subscribe(listener) // subscribe to changes
```

### `useToastStore` (React hook)

Reactive hook with optional selector for optimized re-renders:

```tsx
const { toasts, config, setConfig } = useToastStore()

// With selector
const toasts = useToastStore((s) => s.toasts)
const position = useToastStore((s) => s.config.position)
```

### `<ToastContainer />`

| Prop             | Type             | Default        |
| ---------------- | ---------------- | -------------- |
| `position`       | `ToastPosition`  | `'top-center'` |
| `duration`       | `number`         | `4000`         |
| `maxToasts`      | `number`         | `3`            |
| `animation`      | `ToastAnimation` | `'bounce'`     |
| `theme`          | `ToastTheme`     | `'auto'`       |
| `pauseOnHover`   | `boolean`        | `true`         |
| `showProgress`   | `boolean`        | `true`         |
| `swipeToDismiss` | `boolean`        | `true`         |

> Mount only **one** `<ToastContainer>` at the app root.

---

<a id="typescript"></a>

## TypeScript

All types are exported:

```ts
import type {
  Toast,
  ToastInput,
  ToastType,
  ToastPosition,
  ToastAnimation,
  ToastTheme,
  ToastAction,
  ToastRenderFn,
  ToastConfig,
  ToastTypeConfig,
  ToastState,
  ToastActions,
  ToastStore,
  ToastOptions,
  LoadingToastHandle,
  PromiseMessages
} from '@nguyenkhoidev208/nova-toast'
```

### Key Types

```ts
type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading'

type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

type ToastAnimation = 'slide' | 'fade' | 'pop' | 'bounce'

type ToastTheme = 'light' | 'dark' | 'auto'

interface ToastAction {
  label: string
  onClick: () => void
}

interface Toast {
  id: string
  type: ToastType
  message: string
  description?: string
  icon?: unknown
  duration?: number
  action?: ToastAction
  render?: (toast: Toast, dismiss: () => void) => any
}
```

---

<a id="license"></a>

## License

MIT
