import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-glow active:scale-95 disabled:from-primary/50 disabled:to-secondary/50",
        secondary: "bg-gradient-to-r from-secondary/80 to-accent/60 text-white hover:from-secondary hover:to-accent hover:shadow-glow-secondary active:scale-95",
        outline: "border border-border bg-card text-foreground hover:bg-background-tertiary hover:border-primary/50 active:scale-95",
        ghost: "text-foreground hover:bg-background-tertiary/50 active:scale-95",
        accent: "bg-gradient-to-r from-accent to-primary text-background hover:shadow-lg hover:shadow-glow active:scale-95",
        destructive: "bg-destructive text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/50 active:scale-95",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10 p-0",
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
