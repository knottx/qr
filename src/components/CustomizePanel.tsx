import { RotateCcw, TriangleAlert } from 'lucide-react'
import type { ErrorCorrectionLevel } from 'qr-code-styling'
import { useId } from 'react'
import {
  DEFAULT_SETTINGS,
  getScanWarning,
  settingsEqual,
  type CornerCenterStyle,
  type CornerFrameStyle,
  type DotStyle,
  type QrSettings,
} from '../lib/qr'
import { Button } from './Button'
import { ColorField } from './ColorField'
import { Panel } from './Panel'
import { SegmentedControl, type SegmentOption } from './SegmentedControl'
import {
  CenterDotIcon,
  CenterSquareIcon,
  DotDotsIcon,
  DotRoundedIcon,
  DotSquareIcon,
  FrameDotIcon,
  FrameRoundedIcon,
  FrameSquareIcon,
} from './StyleIcons'
import { Switch } from './Switch'

const DOT_OPTIONS: SegmentOption<DotStyle>[] = [
  { value: 'square', label: 'Square', icon: <DotSquareIcon /> },
  { value: 'rounded', label: 'Rounded', icon: <DotRoundedIcon /> },
  { value: 'dots', label: 'Dots', icon: <DotDotsIcon /> },
]

const FRAME_OPTIONS: SegmentOption<CornerFrameStyle>[] = [
  { value: 'square', label: 'Square', icon: <FrameSquareIcon /> },
  { value: 'rounded', label: 'Rounded', icon: <FrameRoundedIcon /> },
  { value: 'dot', label: 'Circle', icon: <FrameDotIcon /> },
]

const CENTER_OPTIONS: SegmentOption<CornerCenterStyle>[] = [
  { value: 'square', label: 'Square', icon: <CenterSquareIcon /> },
  { value: 'dot', label: 'Circle', icon: <CenterDotIcon /> },
]

const EC_OPTIONS: SegmentOption<ErrorCorrectionLevel>[] = [
  { value: 'L', label: 'Low', detail: '7%', description: 'Still scans with about 7% of the code damaged' },
  { value: 'M', label: 'Medium', detail: '15%', description: 'Still scans with about 15% of the code damaged' },
  { value: 'Q', label: 'Quartile', detail: '25%', description: 'Still scans with about 25% of the code damaged' },
  { value: 'H', label: 'High', detail: '30%', description: 'Still scans with about 30% of the code damaged' },
]

const EC_HINT: Record<ErrorCorrectionLevel, string> = {
  L: 'Smallest code',
  M: 'Balanced',
  Q: 'Recommended',
  H: 'Most durable',
}

const WARNINGS = {
  'low-contrast': 'Low contrast between colors may make the code hard to scan.',
  inverted: 'Light-on-dark codes are not supported by every scanner.',
} as const

interface CustomizePanelProps {
  settings: QrSettings
  onChange: (patch: Partial<QrSettings>) => void
  onReset: () => void
}

export function CustomizePanel({ settings, onChange, onReset }: CustomizePanelProps) {
  const id = useId()
  const warning = getScanWarning(settings)
  const isDefault = settingsEqual(settings, DEFAULT_SETTINGS)

  return (
    <Panel
      title="Customize"
      titleId={`${id}-title`}
      action={
        <Button variant="ghost" size="sm" onClick={onReset} disabled={isDefault} className="-mr-2">
          <RotateCcw className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Reset
        </Button>
      }
    >
      <div className="space-y-7">
        <fieldset className="space-y-4">
          <legend className="sr-only">Colors</legend>
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
            <ColorField
              label="Foreground"
              value={settings.foreground}
              onChange={(foreground) => onChange({ foreground })}
            />
            <ColorField
              label="Background"
              value={settings.background}
              onChange={(background) => onChange({ background })}
              disabled={settings.transparent}
            />
          </div>
          <Switch
            label="Transparent background"
            description="Exports without a background fill."
            checked={settings.transparent}
            onChange={(transparent) => onChange({ transparent })}
          />
          {warning ? (
            <p
              role="note"
              className="animate-fade-in flex items-start gap-2 rounded-xl bg-warning/10 px-3 py-2.5 text-xs leading-relaxed text-warning"
            >
              <TriangleAlert className="mt-px size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
              {WARNINGS[warning]}
            </p>
          ) : null}
        </fieldset>

        <div className="h-px bg-border" role="presentation" />

        <div className="space-y-5">
          <SegmentedControl
            label="Dot style"
            value={settings.dotStyle}
            options={DOT_OPTIONS}
            onChange={(dotStyle) => onChange({ dotStyle })}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-[3fr_2fr]">
            <SegmentedControl
              label="Corner frame"
              value={settings.cornerFrame}
              options={FRAME_OPTIONS}
              onChange={(cornerFrame) => onChange({ cornerFrame })}
            />
            <SegmentedControl
              label="Corner center"
              value={settings.cornerCenter}
              options={CENTER_OPTIONS}
              onChange={(cornerCenter) => onChange({ cornerCenter })}
            />
          </div>
        </div>

        <div className="h-px bg-border" role="presentation" />

        <SegmentedControl
          label="Error correction"
          hint={EC_HINT[settings.errorCorrection]}
          value={settings.errorCorrection}
          options={EC_OPTIONS}
          onChange={(errorCorrection) => onChange({ errorCorrection })}
          help="How much of the code can be dirty, damaged or covered and still scan. Higher levels are sturdier but make the pattern denser and hold less text."
        />
      </div>
    </Panel>
  )
}
