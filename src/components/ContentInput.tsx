import { Link2, Type, X } from 'lucide-react'
import { useId } from 'react'
import type { ContentStatus } from '../lib/qr'

interface ContentInputProps {
  value: string
  status: ContentStatus
  onChange: (value: string) => void
}

const numberFormat = new Intl.NumberFormat('en-US')

export function ContentInput({ value, status, onChange }: ContentInputProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const invalid = status.kind === 'too-long'

  return (
    <section
      aria-labelledby={`${id}-label`}
      className="theme-transition rounded-2xl border border-border bg-surface p-5 sm:p-6"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <label id={`${id}-label`} htmlFor={id} className="text-sm font-semibold tracking-tight">
          Content
        </label>
        <ContentBadge status={status} />
      </div>

      <div
        className={[
          'theme-transition relative rounded-xl border bg-bg transition-colors',
          'focus-within:outline-2 focus-within:outline-offset-2',
          invalid
            ? 'border-danger/60 focus-within:outline-danger'
            : 'border-border hover:border-border-strong focus-within:border-border-strong focus-within:outline-ring',
        ].join(' ')}
      >
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a link or type any text…"
          rows={3}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-invalid={invalid}
          aria-describedby={hintId}
          className="block max-h-64 min-h-24 w-full resize-none bg-transparent px-4 py-3 pr-11 text-[15px] leading-relaxed [overflow-wrap:anywhere] text-fg outline-none [field-sizing:content] placeholder:text-fg-subtle"
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              onChange('')
              document.getElementById(id)?.focus()
            }}
            aria-label="Clear content"
            title="Clear"
            className="animate-fade-in absolute top-2.5 right-2.5 flex size-7 cursor-pointer items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-muted hover:text-fg"
          >
            <X className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <p
        id={hintId}
        className={[
          'mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs',
          invalid ? 'text-danger' : 'text-fg-subtle',
        ].join(' ')}
      >
        <span>
          {status.kind === 'empty' && 'Enter a URL or text to generate a QR code.'}
          {status.kind === 'too-long' &&
            'Too long for a QR code at this error correction level. Shorten it or choose a lower level.'}
          {status.kind === 'ok' && 'The preview updates as you type.'}
        </span>
        {status.kind !== 'empty' ? (
          <span className="tabular-nums" aria-label={`${status.bytes} of ${status.max} bytes used`}>
            {numberFormat.format(status.bytes)} / {numberFormat.format(status.max)} bytes
          </span>
        ) : null}
      </p>
    </section>
  )
}

function ContentBadge({ status }: { status: ContentStatus }) {
  if (status.kind !== 'ok') return null
  const Icon = status.isUrl ? Link2 : Type
  return (
    <span className="animate-fade-in inline-flex items-center gap-1.5 rounded-full bg-subtle px-2.5 py-1 text-xs font-medium text-fg-muted">
      <Icon className="size-3.5" strokeWidth={2} aria-hidden="true" />
      {status.isUrl ? 'URL' : 'Text'}
    </span>
  )
}
