import { CircleAlert, CircleCheck } from 'lucide-react'
import type { ToastMessage } from '../hooks/useToast'

/** Toast region. Always mounted so screen readers announce new messages. */
export function Toast({ toast }: { toast: ToastMessage | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
    >
      {toast ? (
        <div
          key={toast.id}
          className="animate-toast-in flex max-w-full items-center gap-2.5 rounded-full bg-accent py-2.5 pr-4 pl-3 text-sm font-medium text-accent-fg shadow-[0_8px_30px_rgb(0_0_0/0.16)]"
        >
          {toast.tone === 'success' ? (
            <CircleCheck className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          ) : (
            <CircleAlert className="size-4 shrink-0 opacity-80" strokeWidth={2} aria-hidden="true" />
          )}
          <span className="truncate">{toast.text}</span>
        </div>
      ) : null}
    </div>
  )
}
