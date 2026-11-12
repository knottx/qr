import QRCodeStyling from 'qr-code-styling'
import { buildQrOptions, type QrSettings } from './qr'

export type ExportFormat = 'png' | 'svg'

const FILE_BASENAME = 'qr-code'

/** Renders a fresh, full-resolution QR code off-screen and returns it as a Blob. */
export async function renderQrBlob(
  content: string,
  settings: QrSettings,
  format: ExportFormat,
): Promise<Blob> {
  const qr = new QRCodeStyling(
    buildQrOptions(content, settings, settings.exportSize, format === 'svg' ? 'svg' : 'canvas'),
  )
  const data = await qr.getRawData(format)
  if (!(data instanceof Blob)) throw new Error('Could not render QR code.')
  // Make sure the MIME type is correct for downloads and the clipboard.
  const type = format === 'svg' ? 'image/svg+xml' : 'image/png'
  return data.type === type ? data : new Blob([data], { type })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.append(link)
  link.click()
  link.remove()
  // Give the browser a moment to start the download before revoking.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function downloadQr(
  content: string,
  settings: QrSettings,
  format: ExportFormat,
): Promise<void> {
  const blob = await renderQrBlob(content, settings, format)
  downloadBlob(blob, `${FILE_BASENAME}-${settings.exportSize}.${format}`)
}

export function canCopyImage(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    typeof ClipboardItem !== 'undefined' &&
    typeof navigator.clipboard?.write === 'function' &&
    (typeof ClipboardItem.supports !== 'function' || ClipboardItem.supports('image/png'))
  )
}

/**
 * Copies a PNG to the clipboard. The ClipboardItem is created synchronously
 * with a Promise so Safari keeps the user-activation context.
 */
export async function copyQrToClipboard(content: string, settings: QrSettings): Promise<void> {
  const item = new ClipboardItem({ 'image/png': renderQrBlob(content, settings, 'png') })
  await navigator.clipboard.write([item])
}
