
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary-glow transition-all duration-300 font-semibold",
        destructive:
          "bg-loss text-white hover:bg-loss/90 hover:shadow-loss-glow transition-all duration-300 font-semibold",
        outline:
          "border-2 border-input bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/70 hover:shadow-primary-glow transition-all duration-300",
        secondary:
          "bg-data-cyan text-white hover:bg-data-cyan/90 hover:shadow-data-glow transition-all duration-300 font-semibold",
        ghost: "hover:bg-primary/15 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline font-semibold",
        profit: "bg-profit text-white hover:bg-profit/90 hover:shadow-profit-glow transition-all duration-300 font-semibold",
        warning: "bg-warning text-black hover:bg-warning/90 transition-all duration-300 font-semibold",
        tech: "bg-tech-purple text-white hover:bg-tech-purple/90 hover:shadow-tech-glow transition-all duration-300 font-semibold",
        bitcoin: "bg-bitcoin hover:bg-bitcoin-dark text-white hover:shadow-[0_0_10px_rgba(247,147,26,0.5)] transition-all duration-300 font-semibold"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
