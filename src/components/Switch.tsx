import { useId } from 'react'

interface SwitchProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/** Toggle switch backed by a native checkbox with `role="switch"`. */
export function Switch({ label, description, checked, onChange }: SwitchProps) {
  const id = useId()
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 py-0.5">
      <span className="min-w-0">
        <span className="block text-[13px] font-medium text-fg">{label}</span>
        {description ? (
          <span id={`${id}-desc`} className="mt-0.5 block text-xs text-fg-subtle">
            {description}
          </span>
        ) : null}
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={description ? `${id}-desc` : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={[
            'h-6 w-10 rounded-full transition-colors duration-200 ease-out-soft',
            'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring',
            checked ? 'bg-accent' : 'bg-muted shadow-[inset_0_0_0_1px_var(--c-border-strong)]',
          ].join(' ')}
        />
        <span
          aria-hidden="true"
          className={[
            'absolute top-0.5 left-0.5 size-5 rounded-full shadow-[0_1px_3px_rgb(0_0_0/0.2)] transition-transform duration-200 ease-out-soft',
            checked ? 'translate-x-4 bg-accent-fg' : 'bg-white',
          ].join(' ')}
        />
      </span>
    </label>
  )
}
