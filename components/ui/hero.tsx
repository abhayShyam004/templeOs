"use client"

import Link from "next/link"
import { FileText, Mail, MapPin, Menu, MessageCircle, ShieldCheck, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { SITE_SETTING_DEFAULTS } from "@/lib/site-settings-defaults"

type SiteSettings = Record<string, string>

type MarqueeItem = {
  id: string
  text: string
  active?: boolean
}

export default function ShaderShowcase() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activePolicyModal, setActivePolicyModal] = useState<"privacy" | "terms" | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SITE_SETTING_DEFAULTS)
  const [marqueeTexts, setMarqueeTexts] = useState<string[]>([
    "ശ്രീ Muthappa Sharanam",
    "Weekly Pooja Bookings Open",
    "Receive Prasadam at Home",
    "Buy Muthappan Goodies",
  ])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || activePolicyModal ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen, activePolicyModal])

  useEffect(() => {
    let mounted = true

    async function loadSiteSettings() {
      try {
        const res = await fetch("/api/site-settings", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (!mounted || typeof data !== "object" || data === null) return
        setSiteSettings({ ...SITE_SETTING_DEFAULTS, ...(data as SiteSettings) })
      } catch {
        // Keep defaults if fetch fails.
      }
    }

    async function loadMarquee() {
      try {
        const res = await fetch("/api/admin/marquee", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (!mounted || !Array.isArray(data)) return

        const texts = data
          .filter((item: MarqueeItem) => item && typeof item.text === "string" && item.active !== false)
          .map((item: MarqueeItem) => item.text.trim())
          .filter(Boolean)

        if (texts.length > 0) {
          setMarqueeTexts(texts)
        }
      } catch {
        // Keep fallback marquee content.
      }
    }

    loadSiteSettings()
    loadMarquee()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#120d0d] font-sans text-[#fef1f0] flex flex-col">
      <div
        className={`fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-[86%] max-w-[360px] border-r border-white/10 bg-[#171111]/95 p-6 backdrop-blur-xl transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <p className="text-base font-extrabold tracking-tight">Temple Menu</p>
          <button
            aria-label="Close menu"
            className="rounded-md border border-white/15 p-2 text-[#fef1f0] transition hover:bg-white/10"
            onClick={() => setIsMenuOpen(false)}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          <Link
            className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#fef1f0] transition hover:bg-white/10"
            href="/poojas"
            onClick={() => setIsMenuOpen(false)}
          >
            Poojas
          </Link>
          <Link
            className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#fef1f0] transition hover:bg-white/10"
            href="/prasadam"
            onClick={() => setIsMenuOpen(false)}
          >
            Prasadam
          </Link>
          <Link
            className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#fef1f0] transition hover:bg-white/10"
            href="/goodies"
            onClick={() => setIsMenuOpen(false)}
          >
            Goodies
          </Link>
          <Link
            className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#fef1f0] transition hover:bg-white/10"
            href={session ? "/dashboard" : "/login"}
            onClick={() => setIsMenuOpen(false)}
          >
            {session ? "Dashboard" : "Login"}
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-[#ff8e84]/25 bg-gradient-to-r from-[#ff8e84]/20 to-[#ff766c]/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#ffd3cf]">Quick Action</p>
          <Link
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[#ff8e84] px-4 py-2.5 text-sm font-bold text-[#650007] transition hover:bg-[#ff766c]"
            href="/poojas"
            onClick={() => setIsMenuOpen(false)}
          >
            Book Pooja
          </Link>
        </div>
      </aside>

      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#120d0d]/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open menu"
              className="rounded-md border border-white/15 p-2 text-[#fef1f0] transition hover:bg-white/10 md:hidden"
              onClick={() => setIsMenuOpen(true)}
              type="button"
            >
              <Menu size={18} />
            </button>
            <Link href="/" className="hidden text-base font-extrabold tracking-tight md:block md:text-xl">ശ്രീ muthappa madapura</Link>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 text-sm font-extrabold tracking-tight md:hidden">
            ശ്രീ muthappa madapura
          </div>

          <div className="hidden items-center space-x-8 text-sm font-bold tracking-tight md:flex">
            <Link className="text-[#b4a8a8] transition-all duration-300 hover:text-[#fef1f0]" href="/poojas">
              Poojas
            </Link>
            <Link className="text-[#b4a8a8] transition-all duration-300 hover:text-[#fef1f0]" href="/prasadam">
              Prasadam
            </Link>
            <Link className="text-[#b4a8a8] transition-all duration-300 hover:text-[#fef1f0]" href="/goodies">
              Goodies
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <Link className="hidden text-sm font-bold text-[#b4a8a8] transition-all hover:text-[#fef1f0] md:block" href={session ? "/dashboard" : "/login"}>
              {session ? "Dashboard" : "Login"}
            </Link>
            <Link
              className="hidden rounded-md bg-[#ff8e84] px-3 py-2 text-xs font-bold text-[#650007] transition-all duration-200 hover:bg-[#ff766c] active:scale-95 md:inline-flex md:px-6 md:text-sm"
              href="/poojas"
            >
              Book Pooja
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <header className="relative z-20 flex min-h-screen items-center overflow-hidden pt-24 md:pt-20">
        <div className="absolute inset-0 z-0">
          <img
            alt="Temple sanctuary background"
            className="h-full w-full object-cover opacity-40 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
            src={siteSettings.home_hero_image || "https://upload.wikimedia.org/wikipedia/commons/5/55/Parassini.jpg"}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120d0d] via-[#120d0d]/60 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto -mt-6 grid w-full max-w-7xl items-center gap-8 px-4 md:mt-0 md:grid-cols-2 md:gap-12 md:px-8">
          <div className="max-w-2xl">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.24em] text-[#f68a2f] sm:mb-4 sm:text-sm sm:tracking-[0.2em]">
              Indiranagar . Hyderabad
            </span>
            <h1 className="mb-5 whitespace-pre-line text-[3rem] font-extrabold leading-[0.9] tracking-tight sm:mb-6 sm:text-5xl md:text-8xl">
              {siteSettings.home_hero_title || "Sri Muthappan Madapura, Indiranagar"}
            </h1>
            <p className="mb-7 max-w-md text-sm leading-relaxed text-[#b4a8a8] sm:text-base md:mb-8 md:text-xl">
              {siteSettings.home_hero_subtitle}
            </p>
            <p className="mb-7 max-w-md text-xs leading-relaxed text-[#ffd3cf] sm:text-sm md:mb-8">
              {siteSettings.home_notice}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                className="rounded-md bg-gradient-to-r from-[#ff8e84] to-[#ff766c] px-3 py-2 text-center text-sm font-bold text-black shadow-xl transition-all hover:shadow-[0_0_40px_rgba(255,142,132,0.2)] sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                href="/prasadam"
              >
                Order Prasadam
              </Link>
              <Link
                className="rounded-md border border-[#7d7373] px-3 py-2 text-center text-sm font-bold text-[#fef1f0] transition-all hover:bg-white/5 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                href="/poojas"
              >
                Poojas
              </Link>
            </div>
          </div>

          <div className="relative -mt-2 md:mt-0">
            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[#ff8e84]/20 blur-[100px] md:-right-20 md:-top-20 md:h-80 md:w-80 md:blur-[120px]" />
            <div className="relative mx-auto w-full max-w-[430px] rotate-[2.5deg] overflow-hidden rounded-xl bg-[#2c2424] p-3 shadow-2xl md:rotate-3 md:max-w-none md:p-4">
              <img
                alt="Muthappa Ritual"
                className="h-[300px] w-full rounded-lg object-cover grayscale transition-all duration-700 hover:grayscale-0 md:h-[500px]"
                src={siteSettings.home_hero_secondary_image || "https://www.almadayans.co.in/images/gallery/img14.jpg"}
              />
            </div>
            <div className="absolute -bottom-6 left-1 z-40 max-w-[190px] -rotate-6 rounded-xl bg-[#ffd709] p-4 text-black shadow-xl md:-bottom-10 md:-left-10 md:max-w-[220px] md:p-6">
              <p className="mb-1 text-3xl leading-none md:text-4xl">✦</p>
              <p className="text-xs font-bold md:text-sm">Weekly Pooja</p>
              <p className="text-xs font-semibold md:text-sm">every friday</p>
              <p className="text-xs font-bold md:text-sm">6:00 PM</p>
            </div>
          </div>
        </div>
      </header>

      <section className="relative z-10 overflow-hidden border-y border-white/10 bg-[#ff8e84] py-6">
        <div className="flex whitespace-nowrap">
          <div className="flex w-max animate-ticker items-center text-base font-extrabold uppercase tracking-tight text-[#650007] sm:text-xl md:text-4xl">
            {[...marqueeTexts, ...marqueeTexts].map((text, index) => (
              <span key={`${text}-${index}`} className="mx-5 md:mx-8">
                {text}
                <span className="mx-5 text-[#650007]/40 md:mx-8">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center md:gap-12">
            <div className="text-left md:text-left">
              <h2 className="mb-2 text-3xl font-bold">Assistance</h2>
              <p className="text-[#b4a8a8]">Available for consultations, rituals, and spiritual guidance.</p>
            </div>
            <div className="flex w-full flex-col gap-6 sm:flex-row sm:flex-wrap sm:justify-start md:w-auto md:justify-center md:gap-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff8e84]/10 text-[#ff8e84]">
                  <span className="text-xl">☎</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#b4a8a8]">Phone</p>
                  <p className="font-bold">{siteSettings.contact_phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe792]/10 text-[#ffe792]">
                  <span className="text-xl">⌖</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#b4a8a8]">Location</p>
                  <p className="font-bold">{siteSettings.contact_address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>

      <footer className="flex w-full flex-col items-start justify-between gap-8 bg-[#181212] px-4 py-10 sm:px-6 md:flex-row md:items-center md:px-12">
        <div className="flex flex-col items-start">
          <div className="mb-2 text-lg font-bold text-[#ff8e84]">ശ്രീ Muthappa Madapura</div>
          <p className="text-left text-sm tracking-wide text-[#b4a8a8]">
            © 2026 ശ്രീ muthappa madapura Indiranagar. All Rights Reserved.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm tracking-wide sm:gap-6">
          <button
            className="inline-flex items-center gap-2 text-[#b4a8a8] transition-colors hover:text-[#fef1f0]"
            onClick={() => setActivePolicyModal("privacy")}
            type="button"
          >
            <ShieldCheck size={14} />
            Privacy
          </button>
          <button
            className="inline-flex items-center gap-2 text-[#b4a8a8] transition-colors hover:text-[#fef1f0]"
            onClick={() => setActivePolicyModal("terms")}
            type="button"
          >
            <FileText size={14} />
            Terms
          </button>
          <a
            className="inline-flex items-center gap-2 text-[#b4a8a8] transition-colors hover:text-[#fef1f0]"
            href="https://maps.google.com/?q=Muthappa+Madapura+Indiranagar+Hyderabad"
            rel="noopener noreferrer"
            target="_blank"
          >
            <MapPin size={14} />
            Temple Map
          </a>
          <a className="inline-flex items-center gap-2 text-[#b4a8a8] transition-colors hover:text-[#fef1f0]" href={`mailto:${siteSettings.contact_email}`}>
            <Mail size={14} />
            Contact
          </a>
        </div>

        <div className="flex gap-4">
          <a
            aria-label="Chat on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4e4646] text-[#b4a8a8] transition-all hover:border-[#ff8e84] hover:text-[#ff8e84]"
            href={`https://wa.me/${(siteSettings.contact_phone || "").replace(/\D/g, "")}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle size={18} />
          </a>
          <a
            aria-label="Send email"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4e4646] text-[#b4a8a8] transition-all hover:border-[#ff8e84] hover:text-[#ff8e84]"
            href={`mailto:${siteSettings.contact_email}`}
          >
            <Mail size={18} />
          </a>
        </div>
      </footer>

      {activePolicyModal && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4"
          onClick={() => setActivePolicyModal(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1a1313] p-5 text-[#fef1f0] shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold">{activePolicyModal === "privacy" ? "Privacy Policy" : "Terms & Conditions"}</h3>
              <button
                aria-label="Close policy modal"
                className="rounded-md border border-white/15 p-1.5 text-[#fef1f0] transition hover:bg-white/10"
                onClick={() => setActivePolicyModal(null)}
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            {activePolicyModal === "privacy" ? (
              <div className="space-y-3 text-sm leading-relaxed text-[#d9cfcf]">
                <p>
                  We collect only the information required to provide temple services such as pooja bookings, prasadam orders, and
                  customer support.
                </p>
                <p>Collected information can include your name, phone number, email, address, order details, and booking history.</p>
                <p>
                  Your data is used only for service fulfillment, communication, and record keeping. We do not sell personal data.
                </p>
                <p>
                  Payment processing is handled through trusted payment partners, and this website does not store sensitive payment
                  credentials.
                </p>
                <p>
                  For updates or deletion requests, contact us at{" "}
                  <a className="text-[#ffb0a9] hover:text-[#ffd3cf]" href="mailto:shyamsalila@gmail.com">
                    shyamsalila@gmail.com
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-sm leading-relaxed text-[#d9cfcf]">
                <p>Bookings are confirmed only after successful payment and final verification by the temple administration.</p>
                <p>
                  Pooja schedules, event timings, and service availability may change due to festival schedules, rituals, or
                  operational requirements.
                </p>
                <p>
                  Users are responsible for submitting accurate contact and delivery details for all bookings and prasadam orders.
                </p>
                <p>
                  The temple may cancel or reject bookings that are incomplete, invalid, duplicate, or against temple rules.
                </p>
                <p>By using this website, you agree to these terms and any future updates published by the temple.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
