import { useCallback, useEffect, useState, type SetStateAction } from 'react'

function read<T>(key: string, fallback: T, parse: (value: unknown) => T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : parse(JSON.parse(raw))
  } catch {
    return fallback
  }
}

/**
 * State persisted to localStorage. `parse` validates stored data so stale or
 * tampered values can never put the app into an invalid state.
 */
export function useLocalStorage<T>(
  key: string,
  fallback: T,
  parse: (value: unknown) => T,
): [T, (value: SetStateAction<T>) => void] {
  const [value, setValue] = useState<T>(() => read(key, fallback, parse))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage may be full or unavailable (e.g. private mode) — ignore.
    }
  }, [key, value])

  const set = useCallback((next: SetStateAction<T>) => setValue(next), [])
  return [value, set]
}
