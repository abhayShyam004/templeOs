"use client"

import Link from "next/link"
import { LayoutDashboard, LogIn } from "lucide-react"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useSession } from "next-auth/react"
import { PublicFooter } from "./public-footer"

export function PublicLayoutShell({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const navLinks = [
    { label: "Pooja", href: "/poojas", active: pathname.startsWith("/poojas") },
    { label: "Prasadam", href: "/prasadam", active: pathname.startsWith("/prasadam") },
    { label: "Goodies", href: "/goodies", active: pathname.startsWith("/goodies") },
    { label: "Offerings", href: "/offerings", active: pathname.startsWith("/offerings") },
  ]

  // Pages that use the full-screen PublicMarketplace UI handle their own nav/footer
  const isMarketplacePage = [
    "/", 
    "/poojas", 
    "/prasadam", 
    "/goodies", 
    "/offerings",
    "/donations",
    "/cart",
    "/cart/checkout"
  ].includes(pathname)

  if (isMarketplacePage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 md:px-6">
          <div className="flex min-w-0 items-center justify-between gap-4 md:gap-8 py-2">
            <div className="flex min-w-0 items-center gap-4 md:gap-6">
              <Link href="/" className="shrink-0">
                <span className="text-xl md:text-2xl font-black text-on-surface tracking-tighter font-headline">
                  ശ്രീ muthappa madapura&nbsp;
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <Link
                href={session ? "/dashboard" : "/login"}
                className="hidden md:flex flex-col items-start cursor-pointer hover:bg-surface-container-high px-3 py-1 rounded-lg transition-colors"
              >
                <span className="text-[10px] text-on-surface-variant leading-none">
                  Hello, {session?.user?.name || "Sign in"}
                </span>
                <span className="text-xs font-bold text-on-surface">Account</span>
              </Link>
              {session && (
                <Link
                  href="/my-orders"
                  className="hidden md:flex flex-col items-start cursor-pointer hover:bg-surface-container-high px-3 py-1 rounded-lg transition-colors"
                >
                  <span className="text-[10px] text-on-surface-variant leading-none">Returns</span>
                  <span className="text-xs font-bold text-on-surface">Orders</span>
                </Link>
              )}
              <Link
                href={session ? "/dashboard" : "/login"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition hover:brightness-110 md:hidden"
                aria-label={session ? "Dashboard" : "Login"}
              >
                {session ? <LayoutDashboard className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-8 py-2 overflow-x-auto no-scrollbar scroll-smooth">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${link.active ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-on-surface transition-colors"} text-[10px] md:text-xs font-semibold tracking-tight uppercase whitespace-nowrap`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10 flex-1 w-full">{children}</main>

      <PublicFooter />
    </div>
  )
}
