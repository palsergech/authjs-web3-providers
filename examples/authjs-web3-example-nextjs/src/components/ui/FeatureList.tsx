import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import React from 'react'

const featureListVariants = cva(
  'space-y-2',
  {
    variants: {
      variant: {
        default: 'text-gray-700',
        light: 'text-gray-600',
        dark: 'text-gray-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface FeatureListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof featureListVariants> {
  features: string[]
}

const FeatureList = React.forwardRef<HTMLUListElement, FeatureListProps>(
  ({ className, variant, features, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(featureListVariants({ variant, className }))}
        {...props}
      >
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-2">•</span>
            {feature}
          </li>
        ))}
      </ul>
    )
  }
)
FeatureList.displayName = 'FeatureList'

export { FeatureList, featureListVariants } 