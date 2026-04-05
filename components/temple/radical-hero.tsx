"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function RadicalHero() {
  return (
    <section className="relative h-[100svh] w-full bg-[var(--c-bg)] overflow-hidden selection:bg-[var(--c-accent)] selection:text-black">
      {/* 1. THE BACKGROUND ANCHOR */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
          src="/muthappan2.png" 
          alt="Divine Lineage"
          className="w-full h-full object-cover object-[80%_center] md:object-center grayscale contrast-125"
        />
        {/* Editorial Brutalist Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--c-bg)] via-transparent to-[var(--c-bg)] opacity-80" />
        <div className="absolute inset-0 border-[0.5px] border-black/5 m-6 md:m-12 pointer-events-none" />
      </div>

      {/* 2. THE SCATTERED GRID CONTENT */}
      <div className="relative z-10 h-full w-full grid grid-cols-1 md:grid-cols-12 grid-rows-6 p-6 md:p-12 pointer-events-none">
        
        {/* TOP LEFT: ARCHIVAL METADATA */}
        <div className="col-start-1 col-span-12 md:col-span-4 row-start-1 self-start flex flex-col gap-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--c-text-muted)]">
            Preservation Archive / 04.2026
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
            Heritage Site / Indiranagar
          </p>
        </div>

        {/* TOP RIGHT: REAL-TIME TELEMETRY */}
        <div className="hidden md:flex col-start-9 col-span-4 row-start-1 self-start flex-col items-end gap-2 text-right">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-text)] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--c-text)] font-black">Sanctum Live</span>
          </div>
          <span className="font-serif italic text-sm text-black/30 tracking-tight">Rituals in Progress</span>
        </div>

        {/* CENTER: THE TYPOGRAPHIC COLLISION */}
        <div className="col-start-1 col-span-12 row-start-2 row-span-3 flex flex-col items-center justify-center">
          <h1 className="flex flex-col items-center text-center">
            <motion.span 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="block font-serif font-light text-[clamp(4rem,16vw,18rem)] leading-[0.75] tracking-[-0.06em] text-[var(--c-text)] uppercase"
            >
              MUTHAPPA
            </motion.span>
            <motion.span 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="block font-serif font-light italic text-[clamp(4rem,16vw,18rem)] leading-[0.75] tracking-[-0.04em] text-[var(--c-text-muted)] -mt-[0.1em] md:ml-[1.5em]"
            >
              Madapura
            </motion.span>
          </h1>
        </div>

        {/* BOTTOM LEFT: SACRED NARRATIVE */}
        <div className="col-start-1 col-span-12 md:col-span-5 row-start-6 self-end pointer-events-auto">
          <div className="flex flex-col items-start gap-8">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--c-text)] font-black">
                Indiranagar · Hyderabad
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--c-text-muted)]">
                17.4840° N, 78.4909° E
              </p>
            </div>
            
            <p className="hidden md:block font-serif font-light italic text-[1.3rem] text-black/60 max-w-[36ch] leading-[1.4] border-l-[0.5px] border-black/20 pl-8">
              "Preserving the 400-year lineage of Kunnathurpadi through contemporary ritual arts."
            </p>
          </div>
        </div>

        {/* BOTTOM RIGHT: RADICAL INTERACTION */}
        <div className="col-start-1 col-span-12 md:col-start-9 md:col-span-4 row-start-6 self-end flex flex-col items-start md:items-end gap-8 pointer-events-auto pt-8 md:pt-0">
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Link 
              href="/poojas" 
              className="btn-sacred w-full"
            >
              <span>Explore Rituals</span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
            <div className="flex gap-2">
              <button className="flex-1 border-[0.5px] border-black/20 text-black px-8 py-5 text-[10px] font-mono font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                Live
              </button>
              <button className="flex-1 border-[0.5px] border-black/20 text-black px-8 py-5 text-[10px] font-mono font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                Prasad
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. DYNAMIC AMBIENT ELEMENT */}
      <div className="absolute top-1/2 left-[5%] -translate-y-1/2 opacity-[0.03] pointer-events-none select-none hidden lg:block">
         <span className="font-serif text-[40vw] leading-none italic text-black">ശ്രീ</span>
      </div>
    </section>
  );
}
