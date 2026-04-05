"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="relative py-40 px-8 bg-[var(--c-bg)] text-center overflow-hidden" id="book">
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none">
         <span className="font-serif text-[60vw] leading-none italic text-white select-none">നമസ്തേ</span>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center justify-center gap-6 mb-12">
          <span className="w-12 h-[0.5px] bg-[var(--c-accent)]" />
          <p className="label-mono text-[var(--c-accent)]">Digital Sanctuary</p>
          <span className="w-12 h-[0.5px] bg-[var(--c-accent)]" />
        </div>

        <h2 className="display-serif text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] mb-16">
          Eternal <br />
          <span className="italic text-[var(--c-accent)]">Blessings.</span>
        </h2>

        <p className="body-text text-lg italic text-[var(--c-text-muted)] max-w-xl mx-auto mb-20 leading-relaxed">
          The temple doors are always open. Experience the raw, inclusive traditions of North Malabar from anywhere in the world.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/poojas"
            className="btn-sacred w-full md:w-auto"
          >
            Book a Ritual
          </Link>
          <Link
            href="/prasadam"
            className="group relative border-[0.5px] border-[var(--c-border-strong)] text-[var(--c-text)] px-12 py-4 font-mono text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:border-[var(--c-accent)] w-full md:w-auto overflow-hidden"
          >
            <span className="relative z-10">Order Prasad</span>
            <div className="absolute inset-0 bg-[var(--c-accent)] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </div>
      </div>
    </section>
  );
}
