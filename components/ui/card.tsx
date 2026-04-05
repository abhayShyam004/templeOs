import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[rgba(212,175,55,0.18)] bg-[rgba(59,10,10,0.82)] text-[#FFF8F0] shadow-[0_24px_60px_rgba(59,10,10,0.24)] backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}
