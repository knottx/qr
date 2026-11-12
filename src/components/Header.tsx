import { LayoutGrid } from 'lucide-react'
import type { ThemePreference } from '../hooks/useTheme'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  theme: ThemePreference
  onThemeChange: (value: ThemePreference) => void
}

export function Header({ theme, onThemeChange }: HeaderProps) {
  return (
    <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
      <a
        href={import.meta.env.BASE_URL}
        className="-mx-1.5 flex min-w-0 items-center gap-2.5 rounded-lg px-1.5 py-1"
        aria-label="QR Generator — home"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-accent text-accent-fg">
          <Logo className="size-[18px]" />
        </span>
        <span className="truncate text-[15px] font-semibold tracking-tight max-[359px]:sr-only">
          QR Generator
        </span>
      </a>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <a
          href="https://knottx.dev/tools/"
          className="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium text-fg-muted transition-colors duration-150 hover:bg-subtle hover:text-fg"
        >
          <LayoutGrid className="size-4 sm:hidden" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Knot’s Tools</span>
        </a>
        <ThemeToggle value={theme} onChange={onThemeChange} />
      </div>
    </header>
  )
}
