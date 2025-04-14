import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import React from 'react'

const logoVariants = cva(
  'flex items-center justify-center rounded-2xl',
  {
    variants: {
      size: {
        sm: 'w-16 h-16',
        md: 'w-20 h-20',
        lg: 'w-24 h-24',
      },
      variant: {
        primary: 'bg-blue-600',
        secondary: 'bg-gray-800',
        white: 'bg-white',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
)

export interface LogoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof logoVariants> {
  text?: string
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, size, variant, text = 'A3', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(logoVariants({ size, variant, className }))}
        {...props}
      >
        <span className={cn(
          'font-bold text-white',
          {
            'text-3xl': size === 'sm',
            'text-4xl': size === 'md',
            'text-5xl': size === 'lg',
          }
        )}>
          {text}
        </span>
      </div>
    )
  }
)
Logo.displayName = 'Logo'

export { Logo, logoVariants } 