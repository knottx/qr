import { Check, Copy, Download, LoaderCircle, QrCode, TriangleAlert } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useQrPreview } from '../hooks/useQrPreview'
import type { ToastTone } from '../hooks/useToast'
import { canCopyImage, copyQrToClipboard, downloadQr, type ExportFormat } from '../lib/export'
import type { ContentStatus, ExportSize, QrSettings } from '../lib/qr'
import { Button } from './Button'
import { SegmentedControl, type SegmentOption } from './SegmentedControl'

const SIZE_OPTIONS: SegmentOption<ExportSize>[] = [
  { value: 512, label: '512' },
  { value: 1024, label: '1K', description: '1024 pixels' },
  { value: 2048, label: '2K', description: '2048 pixels' },
  { value: 4096, label: '4K', description: '4096 pixels' },
]

type Action = ExportFormat | 'copy'

interface PreviewPanelProps {
  /** Latest (undebounced) values used for exports. */
  content: string
  settings: QrSettings
  status: ContentStatus
  /** Debounced values used for the live preview. */
  previewContent: string
  previewSettings: QrSettings
  previewStatus: ContentStatus
  onSizeChange: (size: ExportSize) => void
  notify: (tone: ToastTone, text: string) => void
}

export function PreviewPanel({
  content,
  settings,
  status,
  previewContent,
  previewSettings,
  previewStatus,
  onSizeChange,
  notify,
}: PreviewPanelProps) {
  const id = useId()
  const hasPreview = previewStatus.kind === 'ok'
  const { containerRef, error } = useQrPreview(hasPreview ? previewContent : null, previewSettings)
  const [busy, setBusy] = useState<Action | null>(null)
  const [copied, setCopied] = useState(false)
  const [copySupported] = useState(canCopyImage)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  const canExport = status.kind === 'ok' && !error && busy === null

  const run = async (action: Action) => {
    if (!canExport) return
    setBusy(action)
    try {
      if (action === 'copy') {
        await copyQrToClipboard(content, settings)
        setCopied(true)
        notify('success', 'Copied to clipboard')
      } else {
        await downloadQr(content, settings, action)
        notify('success', `Downloaded ${action.toUpperCase()}`)
      }
    } catch (err) {
      console.error(err)
      notify(
        'error',
        action === 'copy' ? 'Could not copy image to clipboard' : 'Export failed. Please try again.',
      )
    } finally {
      setBusy(null)
    }
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="theme-transition rounded-2xl border border-border bg-surface"
    >
      <header className="flex min-h-14 items-center justify-between gap-3 border-b border-border px-5 py-3 sm:px-6">
        <h2 id={`${id}-title`} className="text-sm font-semibold tracking-tight">
          Preview
        </h2>
        <span className="text-xs text-fg-subtle tabular-nums">
          {settings.exportSize} × {settings.exportSize} px
        </span>
      </header>

      <div className="p-5 sm:p-6">
        <div
          className={[
            'theme-transition relative mx-auto aspect-square w-full max-w-[22rem] overflow-hidden rounded-2xl',
            previewSettings.transparent ? 'checkerboard' : 'bg-subtle',
          ].join(' ')}
        >
          <div
            ref={containerRef}
            role="img"
            aria-label={hasPreview ? `QR code for: ${truncate(previewContent, 120)}` : undefined}
            aria-hidden={!hasPreview || Boolean(error)}
            className={[
              'qr-canvas absolute inset-0 transition-opacity duration-200',
              hasPreview && !error ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
          {!hasPreview || error ? (
            <PreviewPlaceholder
              tone={previewStatus.kind === 'too-long' || error ? 'error' : 'empty'}
              message={
                error ??
                (previewStatus.kind === 'too-long'
                  ? 'Content is too long to encode'
                  : 'Your QR code will appear here')
              }
            />
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          <SegmentedControl
            label="Export size"
            hint="pixels"
            size="sm"
            value={settings.exportSize}
            options={SIZE_OPTIONS}
            onChange={onSizeChange}
          />

          <div className="space-y-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!canExport}
              onClick={() => void run('png')}
              aria-busy={busy === 'png'}
            >
              {busy === 'png' ? (
                <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />
              ) : (
                <Download className="size-4" strokeWidth={2} aria-hidden="true" />
              )}
              Download PNG
            </Button>
            <div className={copySupported ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-1'}>
              <Button
                variant="secondary"
                className="w-full"
                disabled={!canExport}
                onClick={() => void run('svg')}
                aria-busy={busy === 'svg'}
              >
                {busy === 'svg' ? (
                  <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />
                ) : (
                  <Download className="size-4" strokeWidth={2} aria-hidden="true" />
                )}
                SVG
              </Button>
              {copySupported ? (
                <Button
                  variant="secondary"
                  className="w-full"
                  disabled={!canExport}
                  onClick={() => void run('copy')}
                  aria-busy={busy === 'copy'}
                >
                  {busy === 'copy' ? (
                    <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />
                  ) : copied ? (
                    <Check className="size-4 text-success" strokeWidth={2.25} aria-hidden="true" />
                  ) : (
                    <Copy className="size-4" strokeWidth={2} aria-hidden="true" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PreviewPlaceholder({ tone, message }: { tone: 'empty' | 'error'; message: string }) {
  const Icon = tone === 'error' ? TriangleAlert : QrCode
  return (
    <div className="animate-fade-in absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
      <span
        className={[
          'flex size-12 items-center justify-center rounded-2xl border border-dashed',
          tone === 'error' ? 'border-danger/40 text-danger' : 'border-border-strong text-fg-subtle',
        ].join(' ')}
      >
        <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <p className={['text-sm', tone === 'error' ? 'text-danger' : 'text-fg-subtle'].join(' ')}>
        {message}
      </p>
    </div>
  )
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}
