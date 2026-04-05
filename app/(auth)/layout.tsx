"use client";

import { usePathname } from "next/navigation";
import { PublicFooter } from "@/components/temple/public-footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Auth pages use their own full-screen designs from provided HTML
  const isCustomPage = ["/login", "/register"].includes(pathname);

  if (isCustomPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen temple-theme-bg flex flex-col font-body text-on-surface">
      <div className="mx-auto flex flex-1 w-full max-w-5xl items-center justify-center px-4 py-10 md:px-8">
        <div className="temple-glass w-full max-w-md rounded-3xl p-5 md:p-7">{children}</div>
      </div>
      <PublicFooter />
    </div>
  );
}
