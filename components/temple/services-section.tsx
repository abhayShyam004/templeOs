"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const services = [
  {
    num: "01",
    name: "Pooja Booking",
    href: "/poojas",
    desc: "Reserve an auspicious ceremony performed in your name by our priests. Receive a blessing certificate after completion.",
    icon: (
      <svg className="w-10 h-10 mb-6 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" />
        <path d="M20 8v4M20 28v4M8 20h4M28 20h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    num: "02",
    name: "Prasad Delivery",
    href: "/prasadam",
    desc: "Receive blessed temple prasad — kadala, coconut, and pure tea — shipped directly to your home via India Post.",
    icon: (
      <svg className="w-10 h-10 mb-6 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 40 40" fill="none">
        <rect x="8" y="14" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1" />
        <path d="M14 14V10a6 6 0 0112 0v4" stroke="currentColor" strokeWidth="1" />
        <circle cx="20" cy="22" r="3" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    num: "03",
    name: "E-Darshan",
    href: "/darshan",
    desc: "Join the live darshan stream from anywhere in the world. Morning and evening rituals broadcast daily.",
    icon: (
      <svg className="w-10 h-10 mb-6 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1" />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.4" />
        <path d="M20 4C11.2 4 4 11.2 4 20s7.2 16 16 16 16-7.2 16-16S28.8 4 20 4z" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    num: "04",
    name: "Pooja Certificate",
    href: "/my-bookings",
    desc: "Auto-generated PDF certificate with devotee name, nakshatra, pooja details, and temple seal. Emailed instantly.",
    icon: (
      <svg className="w-10 h-10 mb-6 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 40 40" fill="none">
        <rect x="8" y="6" width="24" height="30" rx="2" stroke="currentColor" strokeWidth="1" />
        <path d="M14 14h12M14 20h12M14 26h7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="28" cy="28" r="6" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1" />
        <path d="M25.5 28l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function ServicesSection() {
  const { data: session } = useSession();
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-background" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 text-gold text-[10px] uppercase tracking-[0.24em] mb-4">
            <span className="w-8 h-px bg-gold" />
            How We Serve
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-foreground">
            പുണ്യ സേവനങ്ങൾ<br />
            {session && <em className="italic text-gold not-italic">delivered to you</em>}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 border border-border/40">
          {services.map((service) => (
            <div key={service.num}>
              <Link
                href={service.href}
                className="group block bg-background p-10 h-full relative overflow-hidden transition-all duration-500 hover:bg-gold/5"
              >
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <div className="font-serif text-6xl text-foreground/5 mb-8 group-hover:text-gold/10 transition-colors duration-500">
                  {service.num}
                </div>
                {service.icon}
                <h3 className="font-serif text-2xl font-normal text-foreground mb-4 leading-tight">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8 opacity-70 group-hover:opacity-100 transition-opacity">
                  {service.desc}
                </p>
                <div className="text-[10px] uppercase tracking-[0.18em] text-gold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                  Learn More <span>→</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
