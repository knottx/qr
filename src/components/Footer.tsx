import { Lock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pt-4 pb-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 border-t border-border pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5">
          <Lock className="size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          Generated locally in your browser. Nothing is uploaded or tracked.
        </p>
        <p>
          © {new Date().getFullYear()}{' '}
          <a
            href="https://knottx.dev"
            className="rounded font-medium text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
          >
            Visarut Tippun
          </a>
        </p>
      </div>
    </footer>
  )
}
