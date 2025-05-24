
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-data-cyan text-white hover:bg-data-cyan/80",
        destructive:
          "border-transparent bg-loss text-white hover:bg-loss/80",
        outline: "text-foreground border-foreground/30 hover:bg-foreground/10",
        success: "border-transparent bg-profit text-white hover:bg-profit/80",
        warning: "border-transparent bg-warning text-black hover:bg-warning/80",
        info: "border-transparent bg-data-cyan text-white hover:bg-data-cyan/80",
        tech: "border-transparent bg-tech-purple text-white hover:bg-tech-purple/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
