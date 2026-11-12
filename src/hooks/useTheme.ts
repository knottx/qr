import { useEffect, useSyncExternalStore } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'qr:theme'
const THEMES: readonly ThemePreference[] = ['system', 'light', 'dark']

const parseTheme = (value: unknown): ThemePreference =>
  THEMES.includes(value as ThemePreference) ? (value as ThemePreference) : 'system'

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

function subscribe(onChange: () => void) {
  const query = darkQuery()
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export function useTheme() {
  const [preference, setPreference] = useLocalStorage<ThemePreference>(
    THEME_STORAGE_KEY,
    'system',
    parseTheme,
  )
  const systemDark = useSyncExternalStore(subscribe, () => darkQuery().matches)
  const resolved: ResolvedTheme =
    preference === 'system' ? (systemDark ? 'dark' : 'light') : preference

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolved === 'dark')
    root.style.colorScheme = resolved
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolved === 'dark' ? '#0a0a0a' : '#fafafa')
  }, [resolved])

  return { preference, resolved, setPreference }
}
