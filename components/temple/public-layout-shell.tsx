"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useSession } from "next-auth/react"
import { PublicFooter } from "./public-footer"

export function PublicLayoutShell({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()

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
    <div className="min-h-screen temple-theme-bg text-[#fff8ea] flex flex-col">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl leading-none">ॐ</span>
            <span className="text-sm font-medium tracking-wide text-white/90 md:text-base">Sri Muthappan Madapura</span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <Link href="/poojas" className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white">
              Poojas
            </Link>
            <Link href="/prasadam" className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white">
              Prasadam
            </Link>
            <Link href="/goodies" className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white">
              Goodies
            </Link>
            <Link href="/offerings" className="rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white">
              Offerings
            </Link>
          </nav>
          <Link href={session ? "/dashboard" : "/login"} className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-white/90">
            {session ? "Dashboard" : "Login"}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10 flex-1 w-full">{children}</main>

      <PublicFooter />
    </div>
  )
}
