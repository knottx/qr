/** Tiny glyphs illustrating each dot / corner style in the segmented controls. */

const common = { viewBox: '0 0 16 16', className: 'size-3.5', 'aria-hidden': true } as const

export function DotSquareIcon() {
  return (
    <svg {...common} fill="currentColor">
      <rect x="2" y="2" width="5" height="5" />
      <rect x="9" y="2" width="5" height="5" />
      <rect x="2" y="9" width="5" height="5" />
    </svg>
  )
}

export function DotRoundedIcon() {
  return (
    <svg {...common} fill="currentColor">
      <rect x="2" y="2" width="5" height="5" rx="1.75" />
      <rect x="9" y="2" width="5" height="5" rx="1.75" />
      <rect x="2" y="9" width="5" height="5" rx="1.75" />
    </svg>
  )
}

export function DotDotsIcon() {
  return (
    <svg {...common} fill="currentColor">
      <circle cx="4.5" cy="4.5" r="2.5" />
      <circle cx="11.5" cy="4.5" r="2.5" />
      <circle cx="4.5" cy="11.5" r="2.5" />
    </svg>
  )
}

export function FrameSquareIcon() {
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2.5" y="2.5" width="11" height="11" />
    </svg>
  )
}

export function FrameRoundedIcon() {
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2.5" y="2.5" width="11" height="11" rx="3.5" />
    </svg>
  )
}

export function FrameDotIcon() {
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="8" r="5.5" />
    </svg>
  )
}

export function CenterSquareIcon() {
  return (
    <svg {...common} fill="currentColor">
      <rect x="4" y="4" width="8" height="8" />
    </svg>
  )
}

export function CenterDotIcon() {
  return (
    <svg {...common} fill="currentColor">
      <circle cx="8" cy="8" r="4.5" />
    </svg>
  )
}
