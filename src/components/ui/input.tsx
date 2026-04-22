import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[rgba(13,95,82,0.08)]",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
