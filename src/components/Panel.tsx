import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  titleId: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Panel({ title, titleId, action, children, className = '' }: PanelProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={`theme-transition rounded-2xl border border-border bg-surface ${className}`}
    >
      <header className="flex min-h-14 items-center justify-between gap-3 border-b border-border px-5 py-3 sm:px-6">
        <h2 id={titleId} className="text-sm font-semibold tracking-tight text-fg">
          {title}
        </h2>
        {action}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}
