"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const poojas = [
  {
    id: "01",
    name: "Thiruvappana",
    tag: "Principal Offering",
    desc: "The principal ritual — flowers, lamps, and divine chants dedicated to Lord Muthappan.",
    image: "/muthappan.png"
  },
  {
    id: "02",
    name: "Vellattam",
    tag: "Sacred Purity",
    desc: "A distinctive ritual with white offerings symbolising purity and divine clarity.",
    image: "/muthappan2.png"
  },
  {
    id: "03",
    name: "Karimkalasam",
    tag: "Divine Protection",
    desc: "Traditional water ritual for purification and protection of family and home.",
    image: "/muthappan.png"
  }
];

export function PoojasSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="manuscript-section px-8 md:px-12" id="poojas">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Left: Sticky Text */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
           <p className="label-mono mb-8 text-[var(--c-accent)] flex items-center gap-4">
             <span className="w-12 h-[1px] bg-[var(--c-accent)]" />
             RITUALS & OFFERINGS
           </p>
           <h2 className="display-serif text-[var(--t-h1)] mb-12">
             Sacred <br />
             <span className="italic">Traditions.</span>
           </h2>
           <p className="body-text text-[var(--t-lg)] italic text-[var(--c-text-muted)]">
             Each ceremony is performed following strict ancestral Vedic principles, ensuring the spiritual well-being of every devotee.
           </p>
           <div className="mt-16">
              <Link href="/poojas" className="btn-sacred">
                 Explore Catalog
              </Link>
           </div>
        </div>

        {/* Right: Interactive Editorial List */}
        <div className="lg:col-span-8">
           <div className="flex flex-col border-t border-[var(--c-border-strong)]">
              {poojas.map((pooja, i) => (
                <Link
                  key={pooja.id}
                  href={`/poojas`}
                  className="group relative py-12 border-b border-[var(--c-border-strong)] flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-700 hover:px-8"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center gap-8 md:gap-16 relative z-10">
                     <span className="label-mono text-[var(--c-accent)] opacity-40">{pooja.id}</span>
                     <div>
                        <h3 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-none group-hover:italic transition-all duration-700">
                          {pooja.name}
                        </h3>
                        <p className="label-mono mt-2 opacity-60 tracking-[0.3em] italic">{pooja.tag}</p>
                     </div>
                  </div>

                  <div className="md:max-w-xs relative z-10">
                     <p className="body-text text-sm opacity-60 group-hover:opacity-100 transition-opacity">
                       {pooja.desc}
                     </p>
                  </div>

                  {/* Hover Image Reveal */}
                  <AnimatePresence>
                    {hoveredIndex === i && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8, rotate: 5, x: 50 }}
                        animate={{ opacity: 1, scale: 1, rotate: -2, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 5, x: 50 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-[10%] top-[-20%] w-64 aspect-[3/4] rounded-[3rem] overflow-hidden pointer-events-none z-0 hidden lg:block shadow-2xl"
                      >
                        <img src={pooja.image} className="w-full h-full object-cover grayscale" alt={pooja.name} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              ))}
           </div>
        </div>

      </div>
    </section>
  );
}
