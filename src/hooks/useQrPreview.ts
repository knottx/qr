import QRCodeStyling from 'qr-code-styling'
import { useEffect, useRef, useState } from 'react'
import { buildQrOptions, type QrSettings } from '../lib/qr'

/** Internal canvas resolution of the preview; it is scaled down to fit (sharp on 2x screens). */
const PREVIEW_SIZE = 800

/**
 * Renders a live QR preview into the returned container ref. A single
 * QRCodeStyling instance is reused and updated in place. The container must
 * stay mounted; pass `null` content to keep the last render untouched.
 */
export function useQrPreview(content: string | null, settings: QrSettings) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || content === null) return

    try {
      const options = buildQrOptions(content, settings, PREVIEW_SIZE, 'canvas')
      if (!qrRef.current) {
        qrRef.current = new QRCodeStyling(options)
        qrRef.current.append(container)
      } else {
        // update() re-renders into the container passed to append().
        qrRef.current.update(options)
      }
      setError(null)
    } catch (err) {
      console.error(err)
      setError('This content could not be encoded as a QR code.')
    }
  }, [content, settings])

  return { containerRef, error }
}
