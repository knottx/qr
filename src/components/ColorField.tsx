import { useEffect, useId, useState } from 'react'
import { normalizeHex } from '../lib/qr'

interface ColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

/** Native colour picker paired with an editable hex input. */
export function ColorField({ label, value, onChange, disabled = false }: ColorFieldProps) {
  const id = useId()
  const [draft, setDraft] = useState(value)

  // Keep the text field in sync when the value changes elsewhere (picker, reset).
  useEffect(() => setDraft(value), [value])

  const commit = (text: string) => {
    const hex = normalizeHex(text)
    if (hex) onChange(hex)
    else setDraft(value)
  }

  return (
    <div className={['min-w-0', disabled ? 'opacity-50' : ''].join(' ')}>
      <label htmlFor={`${id}-hex`} className="mb-2 block text-[13px] font-medium text-fg">
        {label}
      </label>
      <div className="theme-transition flex h-10 items-center gap-2 rounded-xl border border-border bg-surface pr-3 pl-1.5 transition-colors focus-within:border-border-strong hover:border-border-strong">
        <span className="relative size-7 shrink-0 overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)] dark:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)]">
          <span className="absolute inset-0" style={{ backgroundColor: value }} aria-hidden="true" />
          <input
            type="color"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label} picker`}
            className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
        </span>
        <input
          id={`${id}-hex`}
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          maxLength={7}
          disabled={disabled}
          value={draft.toUpperCase()}
          onChange={(e) => {
            setDraft(e.target.value)
            const hex = normalizeHex(e.target.value)
            if (hex && e.target.value.replace('#', '').length === 6) onChange(hex)
          }}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit(e.currentTarget.value)
          }}
          className="w-full min-w-0 bg-transparent font-mono text-[13px] tracking-wide text-fg uppercase outline-none disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}
