"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function DarshanSection() {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setIsLive(data.isLive);
        }
      } catch (error) {}
    }
    fetchStatus();
  }, []);

  return (
    <section className="relative py-40 px-8 overflow-hidden bg-[var(--c-surface)]" id="darshan">
      
      {/* Floating Meta Data */}
      <div className="absolute top-20 right-20 text-right hidden lg:block">
         <p className="label-mono mb-2 text-[var(--c-accent)]">Current Phase</p>
         <h4 className="font-serif text-2xl italic">"Deeparadhana"</h4>
      </div>

      <div className="max-w-screen-2xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-24">
           <p className="label-mono mb-6 tracking-[0.4em] opacity-40">LIVE E-DARSHAN</p>
           <h2 className="display-serif text-[var(--t-h1)] leading-none italic">
             Eternal <span className="text-[var(--c-accent)]">Gaze.</span>
           </h2>
        </div>

        {/* The "Sacred Canvas" — Organic mask */}
        <div className="relative w-full max-w-6xl aspect-[16/8]">
           
           {/* Decorative Hairline SVG lines connecting to annotations */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible" viewBox="0 0 1000 500">
              <motion.path 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2 }}
                d="M100,50 L250,150" stroke="var(--c-accent)" fill="none" strokeWidth="0.5" />
              <motion.path 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
                d="M900,450 L750,350" stroke="var(--c-accent)" fill="none" strokeWidth="0.5" />
           </svg>

           {/* Annotation 1: Time */}
           <motion.div 
             whileInView={{ opacity: 1, scale: 1 }}
             initial={{ opacity: 0, scale: 0.8 }}
             className="absolute -top-10 -left-10 z-30 p-6 bg-[var(--c-bg)] border border-[var(--c-accent)] rounded-full shadow-2xl"
           >
              <p className="label-mono text-[var(--c-accent)] font-bold">LIVE STREAM</p>
              <p className="font-serif text-xl italic leading-none mt-1">Active Now</p>
           </motion.div>

           {/* Main Feed Container — Non-Boxy Mask */}
           <div 
             className="w-full h-full overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] relative"
             style={{ clipPath: 'ellipse(90% 80% at 50% 50%)' }}
           >
              <div className="absolute inset-0 bg-stone-900 flex items-center justify-center">
                 <div className="text-center">
                    <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center text-4xl mb-8 mx-auto animate-pulse">
                      🪔
                    </div>
                    {isLive ? (
                      <Link href="/darshan" className="btn-sacred bg-white text-[var(--c-text)]">
                        Enter Sanctum
                      </Link>
                    ) : (
                      <p className="label-mono text-white/40">Feed currently offline / Returning soon</p>
                    )}
                 </div>
              </div>
           </div>

           {/* Annotation 2: Location */}
           <motion.div 
             whileInView={{ opacity: 1, x: 0 }}
             initial={{ opacity: 0, x: 50 }}
             className="absolute -bottom-10 -right-10 z-30 p-8 bg-[var(--c-text)] text-[var(--c-bg)] rounded-[3rem] shadow-2xl max-w-xs"
           >
              <p className="label-mono text-[var(--c-accent)] mb-4">OBSERVATION</p>
              <p className="body-text text-sm italic opacity-80 leading-relaxed">
                Rituals are performed in the sacred grove of Indira Nagar, maintaining the purity of North Malabar heritage.
              </p>
           </motion.div>

        </div>

        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-16 border-t border-[var(--c-border-strong)] pt-16 w-full">
           {['05:30 NIRMALYA', '08:00 THIRUVAPPANA', '18:30 DEEPARADHANA', '20:00 ATHAZHAPOOJA'].map(time => (
             <div key={time} className="text-center">
                <p className="label-mono opacity-40">{time.split(' ')[0]}</p>
                <p className="font-serif text-xl italic mt-2">{time.split(' ')[1]}</p>
             </div>
           ))}
        </div>

      </div>
    </section>
  );
}
