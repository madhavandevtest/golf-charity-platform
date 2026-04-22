import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-[var(--color-brand)] text-white shadow-[0_18px_45px_rgba(13,95,82,0.22)] hover:bg-[var(--color-brand-strong)]",
  secondary:
    "bg-white/10 text-[var(--color-ink)] ring-1 ring-white/15 hover:bg-white/15",
  ghost:
    "bg-transparent text-[var(--color-ink)] ring-1 ring-[var(--color-line)] hover:bg-[var(--color-surface)]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: keyof typeof variants;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-60",
          variants[variant],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
