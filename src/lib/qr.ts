import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  ErrorCorrectionLevel,
  Options,
} from 'qr-code-styling'

export type DotStyle = 'square' | 'rounded' | 'dots'
export type CornerFrameStyle = 'square' | 'rounded' | 'dot'
export type CornerCenterStyle = 'square' | 'dot'
export type ExportSize = 512 | 1024 | 2048 | 4096

export interface QrSettings {
  foreground: string
  background: string
  transparent: boolean
  dotStyle: DotStyle
  cornerFrame: CornerFrameStyle
  cornerCenter: CornerCenterStyle
  errorCorrection: ErrorCorrectionLevel
  exportSize: ExportSize
}

export const DEFAULT_CONTENT = 'https://knottx.dev'

export const DEFAULT_SETTINGS: QrSettings = {
  foreground: '#111111',
  background: '#ffffff',
  transparent: false,
  dotStyle: 'square',
  cornerFrame: 'square',
  cornerCenter: 'square',
  errorCorrection: 'Q',
  exportSize: 1024,
}

export const DOT_STYLES: readonly DotStyle[] = ['square', 'rounded', 'dots']
export const CORNER_FRAME_STYLES: readonly CornerFrameStyle[] = ['square', 'rounded', 'dot']
export const CORNER_CENTER_STYLES: readonly CornerCenterStyle[] = ['square', 'dot']
export const ERROR_CORRECTION_LEVELS: readonly ErrorCorrectionLevel[] = ['L', 'M', 'Q', 'H']
export const EXPORT_SIZES: readonly ExportSize[] = [512, 1024, 2048, 4096]

/** Maximum byte-mode payload for a version 40 QR code at each error correction level. */
export const BYTE_CAPACITY: Record<ErrorCorrectionLevel, number> = {
  L: 2953,
  M: 2331,
  Q: 1663,
  H: 1273,
}

const DOT_TYPE: Record<DotStyle, DotType> = {
  square: 'square',
  rounded: 'rounded',
  dots: 'dots',
}

const CORNER_SQUARE_TYPE: Record<CornerFrameStyle, CornerSquareType> = {
  square: 'square',
  rounded: 'extra-rounded',
  dot: 'dot',
}

const CORNER_DOT_TYPE: Record<CornerCenterStyle, CornerDotType> = {
  square: 'square',
  dot: 'dot',
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

const HEX_COLOR = /^#[0-9a-f]{6}$/i

export function isHexColor(value: string): boolean {
  return HEX_COLOR.test(value)
}

/** Normalises user-typed colours like `fff`, `#FFF` or `#ffffff` to `#ffffff`. */
export function normalizeHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, '').toLowerCase()
  if (/^[0-9a-f]{3}$/.test(raw)) {
    return `#${raw
      .split('')
      .map((c) => c + c)
      .join('')}`
  }
  if (/^[0-9a-f]{6}$/.test(raw)) return `#${raw}`
  return null
}

function pick<T>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback
}

/** Safely coerces untrusted (e.g. localStorage) data into valid settings. */
export function sanitizeSettings(input: unknown): QrSettings {
  if (typeof input !== 'object' || input === null) return DEFAULT_SETTINGS
  const s = input as Record<string, unknown>
  const d = DEFAULT_SETTINGS
  return {
    foreground: typeof s.foreground === 'string' && isHexColor(s.foreground) ? s.foreground : d.foreground,
    background: typeof s.background === 'string' && isHexColor(s.background) ? s.background : d.background,
    transparent: typeof s.transparent === 'boolean' ? s.transparent : d.transparent,
    dotStyle: pick(s.dotStyle, DOT_STYLES, d.dotStyle),
    cornerFrame: pick(s.cornerFrame, CORNER_FRAME_STYLES, d.cornerFrame),
    cornerCenter: pick(s.cornerCenter, CORNER_CENTER_STYLES, d.cornerCenter),
    errorCorrection: pick(s.errorCorrection, ERROR_CORRECTION_LEVELS, d.errorCorrection),
    exportSize: pick(s.exportSize, EXPORT_SIZES, d.exportSize),
  }
}

export function settingsEqual(a: QrSettings, b: QrSettings): boolean {
  return (Object.keys(a) as (keyof QrSettings)[]).every((key) => a[key] === b[key])
}

const encoder = new TextEncoder()

export function byteLength(text: string): number {
  return encoder.encode(text).length
}

export type ContentStatus =
  | { kind: 'empty' }
  | { kind: 'too-long'; bytes: number; max: number }
  | { kind: 'ok'; bytes: number; max: number; isUrl: boolean }

export function getContentStatus(content: string, level: ErrorCorrectionLevel): ContentStatus {
  if (content.trim().length === 0) return { kind: 'empty' }
  const bytes = byteLength(content)
  const max = BYTE_CAPACITY[level]
  if (bytes > max) return { kind: 'too-long', bytes, max }
  return { kind: 'ok', bytes, max, isUrl: isLikelyUrl(content) }
}

export function isLikelyUrl(text: string): boolean {
  const value = text.trim()
  if (/\s/.test(value)) return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/* ------------------------------------------------------------------ */
/* Colour contrast                                                     */
/* ------------------------------------------------------------------ */

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r = 0, g = 0, b = 0] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

export type ScanWarning = 'low-contrast' | 'inverted' | null

/** Flags colour combinations that many scanners struggle with. */
export function getScanWarning(settings: QrSettings): ScanWarning {
  if (settings.transparent) return null
  if (contrastRatio(settings.foreground, settings.background) < 3) return 'low-contrast'
  if (luminance(settings.foreground) > luminance(settings.background)) return 'inverted'
  return null
}

/* ------------------------------------------------------------------ */
/* qr-code-styling options                                             */
/* ------------------------------------------------------------------ */

/**
 * qr-code-styling's byte encoder only keeps the low 8 bits of each UTF-16
 * code unit, which corrupts non-ASCII text. Pre-encode to UTF-8 and pass a
 * "binary string" (one char per byte) so every byte survives intact.
 */
export function toUtf8BinaryString(text: string): string {
  const bytes = encoder.encode(text)
  let out = ''
  for (const byte of bytes) out += String.fromCharCode(byte)
  return out
}

/** Quiet zone around the code, proportional to the canvas size. */
export function marginFor(size: number): number {
  return Math.round(size * 0.06)
}

export function buildQrOptions(
  content: string,
  settings: QrSettings,
  size: number,
  type: 'svg' | 'canvas',
): Partial<Options> {
  return {
    type,
    width: size,
    height: size,
    margin: marginFor(size),
    data: toUtf8BinaryString(content),
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: settings.errorCorrection,
    },
    dotsOptions: {
      type: DOT_TYPE[settings.dotStyle],
      color: settings.foreground,
      roundSize: true,
    },
    cornersSquareOptions: {
      type: CORNER_SQUARE_TYPE[settings.cornerFrame],
      color: settings.foreground,
    },
    cornersDotOptions: {
      type: CORNER_DOT_TYPE[settings.cornerCenter],
      color: settings.foreground,
    },
    backgroundOptions: {
      color: settings.transparent ? 'rgba(0,0,0,0)' : settings.background,
    },
  }
}
