import { forwardRef, type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:opacity-90 active:opacity-80',
  secondary:
    'border border-border bg-surface text-fg hover:border-border-strong hover:bg-subtle active:bg-muted',
  ghost: 'text-fg-muted hover:bg-subtle hover:text-fg active:bg-muted',
}

const SIZES = {
  sm: 'h-8 gap-1.5 rounded-lg px-2.5 text-[13px]',
  md: 'h-10 gap-2 rounded-xl px-4 text-sm',
  lg: 'h-11 gap-2 rounded-xl px-4 text-sm',
} as const

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', className = '', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={[
        'inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap select-none',
        'transition-[background-color,border-color,color,opacity,transform] duration-150 ease-out-soft',
        'motion-safe:active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
      {...props}
    />
  )
})
