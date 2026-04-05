import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[rgba(212,175,55,0.28)] bg-[rgba(255,153,51,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#FFD9A8]",
        className,
      )}
    >
      {children}
    </span>
  );
}
