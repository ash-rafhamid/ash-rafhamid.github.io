import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const CHANGE_EVENT = 'portfolio:theme'
// Keep in step with --bg in index.css and the browser chrome colour in index.html.
const themeColors: Record<Theme, string> = { light: '#ffffff', dark: '#0f0f0e' }

export function storedTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

export function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/** Applies and remembers a theme, so the first-visit chooser is not shown again. */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme])
  try { window.localStorage.setItem(STORAGE_KEY, theme) } catch { /* Private windows may refuse storage. */ }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Cross-fades between themes where the browser supports view transitions. */
export function switchTheme(theme: Theme) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced && typeof document.startViewTransition === 'function') document.startViewTransition(() => applyTheme(theme))
  else applyTheme(theme)
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  return () => window.removeEventListener(CHANGE_EVENT, callback)
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, currentTheme, () => 'light')
}
