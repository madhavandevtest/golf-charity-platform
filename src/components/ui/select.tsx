import { cn } from "@/lib/utils";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[rgba(13,95,82,0.08)]",
        props.className,
      )}
    />
  );
}
