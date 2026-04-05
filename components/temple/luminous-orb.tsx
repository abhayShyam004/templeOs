import { cn } from "@/lib/utils";

export function LuminousOrb({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.55),rgba(255,153,51,0.2),transparent_68%)] blur-3xl",
        className,
      )}
    />
  );
}
