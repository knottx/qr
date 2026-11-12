import { useId, type ReactNode } from 'react'

export interface SegmentOption<T extends string | number> {
  value: T
  label: string
  /** Optional secondary line shown under the label (e.g. "25%"). */
  detail?: string
  icon?: ReactNode
  /** Optional longer description announced to assistive tech. */
  description?: string
}

interface SegmentedControlProps<T extends string | number> {
  label: string
  value: T
  options: readonly SegmentOption<T>[]
  onChange: (value: T) => void
  /** Visually hide the group label (it is still announced). */
  hideLabel?: boolean
  size?: 'sm' | 'md'
  hint?: ReactNode
  /** Help text shown below the control and linked to it for assistive tech. */
  help?: ReactNode
}

/**
 * Accessible segmented control built on native radio inputs, so arrow-key
 * navigation and form semantics work out of the box.
 */
export function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
  hideLabel = false,
  size = 'md',
  hint,
  help,
}: SegmentedControlProps<T>) {
  const name = useId()
  const labelId = `${name}-label`
  const helpId = `${name}-help`
  const hasDetail = options.some((option) => option.detail)

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      aria-describedby={help ? helpId : undefined}
      className="min-w-0"
    >
      <div className={hideLabel ? 'sr-only' : 'mb-2 flex items-baseline justify-between gap-3'}>
        <span id={labelId} className="text-[13px] font-medium text-fg">
          {label}
        </span>
        {hint && !hideLabel ? <span className="text-xs text-fg-subtle">{hint}</span> : null}
      </div>
      <div
        className="theme-transition grid gap-1 rounded-xl bg-subtle p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => {
          const checked = option.value === value
          return (
            <label
              key={String(option.value)}
              title={option.description}
              className={[
                'relative flex cursor-pointer select-none items-center justify-center gap-1.5 rounded-[9px] font-medium',
                'transition-[background-color,color,box-shadow] duration-150 ease-out-soft',
                'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-ring',
                hasDetail
                  ? 'min-h-12 flex-col gap-0 px-1.5 py-1.5 text-[13px] leading-tight'
                  : size === 'sm'
                    ? 'h-8 px-2 text-xs'
                    : 'h-9 px-2.5 text-[13px]',
                checked
                  ? 'bg-surface text-fg shadow-[0_1px_2px_rgb(0_0_0/0.06),0_0_0_1px_var(--c-border)] dark:bg-muted dark:shadow-none'
                  : 'text-fg-muted hover:text-fg',
              ].join(' ')}
            >
              <input
                type="radio"
                name={name}
                value={String(option.value)}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
                aria-description={option.description}
              />
              {option.icon ? <span aria-hidden="true" className="shrink-0">{option.icon}</span> : null}
              <span className="max-w-full truncate">{option.label}</span>
              {option.detail ? (
                <span
                  className={[
                    'text-[11px] font-normal tabular-nums',
                    checked ? 'text-fg-muted' : 'text-fg-subtle',
                  ].join(' ')}
                >
                  {option.detail}
                </span>
              ) : null}
            </label>
          )
        })}
      </div>
      {help ? (
        <p id={helpId} className="mt-2 text-xs leading-relaxed text-pretty text-fg-subtle">
          {help}
        </p>
      ) : null}
    </div>
  )
}
