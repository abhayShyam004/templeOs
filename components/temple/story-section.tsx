"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function StorySection() {
  return (
    <section className="relative bg-[var(--c-bg)] py-40 px-8 border-b border-[var(--c-border)] overflow-hidden" id="about">
      {/* Background Archival Mark */}
      <div className="absolute top-10 left-10 opacity-10">
         <p className="label-mono text-[8px]">EST. 1968 / HYDERABAD</p>
      </div>

      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
        
        {/* Left: Typographic Statement */}
        <div className="lg:col-span-7">
          <div className="flex flex-col gap-12">
            <div className="flex items-center gap-6">
              <span className="w-12 h-[0.5px] bg-[var(--c-accent)]" />
              <p className="label-mono text-[var(--c-accent)]">Our Lineage</p>
            </div>
            
            <h2 className="display-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.95]">
              A sanctuary that<br />
              <span className="italic text-[var(--c-accent)]">belongs to all.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
               <p className="body-text text-lg italic text-[var(--c-text-muted)] leading-relaxed">
                 Sri Muthappan — the divine hunter who accepts fish and toddy, transcending conventional ritual boundaries to embrace the common seeker.
               </p>
               <p className="body-text text-sm opacity-60 leading-relaxed border-l border-[var(--c-border-strong)] pl-8">
                 Rooted in the inclusive traditions of North Malabar, our Madapura serves as a spiritual bridge between timeless Vedic principles and the modern digital era.
               </p>
            </div>

            <div className="mt-8">
              <Link
                href="/poojas"
                className="btn-sacred"
              >
                Discover the Way
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Abstract Sacred Geometry */}
        <div className="lg:col-span-5 relative aspect-square group">
           <div className="absolute inset-0 border-[0.5px] border-[var(--c-border-strong)] rotate-45 group-hover:rotate-90 transition-transform duration-[2s] ease-out-expo" />
           <div className="absolute inset-8 border-[0.5px] border-[var(--c-accent)] opacity-20" />
           <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/muthappan.png" 
                className="w-2/3 h-2/3 object-contain grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000" 
                alt="Divine Symbol" 
              />
           </div>
           
           {/* Floating Annotations */}
           <div className="absolute -bottom-4 -left-4 bg-[var(--c-surface)] p-6 border border-[var(--c-border-strong)] shadow-2xl">
              <p className="label-mono text-[9px] mb-1">TRADITION</p>
              <p className="font-serif italic text-xl">"Theyyam"</p>
           </div>
        </div>

      </div>
    </section>
  );
}
