import { ShieldCheck } from 'lucide-react'
import { useCallback, useState } from 'react'
import { ContentInput } from './components/ContentInput'
import { CustomizePanel } from './components/CustomizePanel'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PreviewPanel } from './components/PreviewPanel'
import { Toast } from './components/Toast'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import { useToast } from './hooks/useToast'
import {
  DEFAULT_CONTENT,
  DEFAULT_SETTINGS,
  getContentStatus,
  sanitizeSettings,
  type QrSettings,
} from './lib/qr'

const SETTINGS_STORAGE_KEY = 'qr:settings'

export default function App() {
  const { preference, setPreference } = useTheme()
  const { toast, show } = useToast()

  // QR content is intentionally kept in memory only — never persisted.
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [settings, setSettings] = useLocalStorage<QrSettings>(
    SETTINGS_STORAGE_KEY,
    DEFAULT_SETTINGS,
    sanitizeSettings,
  )

  const updateSettings = useCallback(
    (patch: Partial<QrSettings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [setSettings],
  )

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    show('success', 'Settings reset to defaults')
  }, [setSettings, show])

  // Debounce the expensive preview render; validation stays instant.
  const previewContent = useDebouncedValue(content, 150)
  const previewSettings = useDebouncedValue(settings, 60)

  const status = getContentStatus(content, settings.errorCorrection)
  const previewStatus = getContentStatus(previewContent, previewSettings.errorCorrection)

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#content"
        className="sr-only z-50 rounded-lg bg-accent px-3 py-2 text-sm text-accent-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <Header theme={preference} onThemeChange={setPreference} />

      <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 sm:px-6 lg:px-8">
        <div className="pt-6 pb-8 sm:pt-10 sm:pb-12">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-[2.5rem] sm:leading-[1.1]">
            Free QR code generator
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-pretty text-fg-muted sm:text-base">
            Turn any link or text into a crisp, customizable QR code, then download it as a PNG or
            SVG. Everything is generated locally in your browser — your content never leaves your
            device.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-fg-muted">
            <ShieldCheck className="size-3.5 text-success" strokeWidth={2} aria-hidden="true" />
            Private · No uploads · No tracking
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:gap-6">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <ContentInput value={content} status={status} onChange={setContent} />
          </div>

          <aside
            aria-label="QR code preview and export"
            className="min-w-0 lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
          >
            <PreviewPanel
              content={content}
              settings={settings}
              status={status}
              previewContent={previewContent}
              previewSettings={previewSettings}
              previewStatus={previewStatus}
              onSizeChange={(exportSize) => updateSettings({ exportSize })}
              notify={show}
            />
          </aside>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <CustomizePanel settings={settings} onChange={updateSettings} onReset={resetSettings} />
          </div>
        </div>

        <Faq />
      </main>

      <Footer />
      <Toast toast={toast} />
    </div>
  )
}
