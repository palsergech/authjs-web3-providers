import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import React from 'react'
const textAreaVariants = cva(
  'w-full p-2 text-sm font-mono bg-gray-50 border border-gray-200 rounded-md',
  {
    variants: {
      size: {
        sm: 'h-24',
        md: 'h-32',
        lg: 'h-48',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textAreaVariants> {
  label?: string
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, size, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        )}
        <textarea
          ref={ref}
          className={cn(textAreaVariants({ size, className }))}
          {...props}
        />
      </div>
    )
  }
)
TextArea.displayName = 'TextArea'

export { TextArea, textAreaVariants } 