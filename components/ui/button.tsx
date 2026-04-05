import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-mono uppercase tracking-widest ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-accent)] disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[var(--c-text)] text-[var(--c-text-inv)] border-[1.5px] border-[var(--c-text)] hover:text-[var(--c-text-inv)] before:absolute before:inset-0 before:bg-[var(--c-accent)] before:translate-x-[-101%] before:transition-transform before:duration-300 hover:before:translate-x-0 [&_span]:relative [&_span]:z-10",
        destructive: "bg-[var(--c-accent-pop)] text-[var(--c-text-inv)] hover:bg-[rgba(var(--c-accent-pop-rgb,255,59,0),0.9)]",
        outline: "border-[0.5px] border-[var(--c-border-strong)] bg-transparent text-[var(--c-text)] hover:bg-[var(--c-text)] hover:text-[var(--c-text-inv)]",
        secondary: "bg-[var(--c-surface-2)] text-[var(--c-text)] hover:bg-[var(--c-text)] hover:text-[var(--c-text-inv)]",
        ghost: "bg-transparent text-[var(--c-text)] hover:bg-[var(--c-surface-2)]",
        link: "text-[var(--c-text)] underline-offset-4 hover:underline decoration-[var(--c-accent)]",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-9 px-4 text-[10px]",
        lg: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDefault = variant === "default" || !variant;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isDefault ? <span>{props.children}</span> : props.children}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
