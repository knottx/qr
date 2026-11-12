import { useCallback, useEffect, useRef, useState } from 'react'

export type ToastTone = 'success' | 'error'

export interface ToastMessage {
  id: number
  tone: ToastTone
  text: string
}

export function useToast(duration = 2600) {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const dismiss = useCallback(() => {
    window.clearTimeout(timer.current)
    setToast(null)
  }, [])

  const show = useCallback(
    (tone: ToastTone, text: string) => {
      window.clearTimeout(timer.current)
      setToast({ id: Date.now(), tone, text })
      timer.current = window.setTimeout(() => setToast(null), duration)
    },
    [duration],
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { toast, show, dismiss }
}
