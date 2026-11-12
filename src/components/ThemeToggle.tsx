import { Monitor, Moon, Sun } from 'lucide-react'
import type { ThemePreference } from '../hooks/useTheme'

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light theme', Icon: Sun },
  { value: 'system', label: 'System theme', Icon: Monitor },
  { value: 'dark', label: 'Dark theme', Icon: Moon },
]

interface ThemeToggleProps {
  value: ThemePreference
  onChange: (value: ThemePreference) => void
}

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="theme-transition flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5"
    >
      {OPTIONS.map(({ value: option, label, Icon }) => {
        const checked = option === value
        return (
          <label
            key={option}
            title={label}
            className={[
              'flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-150',
              'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-ring',
              checked ? 'bg-muted text-fg' : 'text-fg-subtle hover:text-fg',
            ].join(' ')}
          >
            <input
              type="radio"
              name="theme"
              value={option}
              checked={checked}
              onChange={() => onChange(option)}
              className="sr-only"
              aria-label={label}
            />
            <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </label>
        )
      })}
    </div>
  )
}
