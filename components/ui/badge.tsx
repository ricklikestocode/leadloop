import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" | "glass"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30",
      secondary: "bg-gradient-to-r from-secondary/20 to-accent/20 text-secondary border border-secondary/30",
      success: "bg-green-500/20 text-green-300 border border-green-500/30",
      warning: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
      destructive: "bg-red-500/20 text-red-300 border border-red-500/30",
      outline: "border border-white/20 text-foreground-secondary hover:border-white/30 hover:text-foreground transition-colors",
      glass: "glass bg-white/10 text-foreground border border-white/20",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-smooth hover:shadow-md",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
