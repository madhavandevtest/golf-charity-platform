import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[var(--color-line)] bg-[var(--color-panel)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
