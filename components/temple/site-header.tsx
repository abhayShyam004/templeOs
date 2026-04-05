"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Rituals', href: '/poojas' },
    { name: 'Offerings', href: '/offerings' },
    { name: 'Sanctum', href: '/darshan' },
  ];

  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled || isOpen
            ? 'h-16 bg-[#0D0D0D] border-b border-white/10' 
            : 'h-24 bg-transparent'
        }`}
      >
        <div className="h-full px-6 md:px-12 flex items-center justify-between max-w-screen-2xl mx-auto relative">
          
          {/* Typographic Logo */}
          <Link href="/" className="flex items-center group">
             <span className="font-serif italic text-2xl text-white group-hover:text-[#C8FF00] transition-colors duration-500 tracking-tighter">
               ശ്രീ              </span>
          </Link>

          {/* Desktop Sparse Nav */}
          <nav className="hidden md:flex items-center gap-16">
            <ul className="flex items-center gap-12 list-none m-0 p-0">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all relative py-2 ${
                      pathname === link.href ? 'text-[#C8FF00]' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="h-4 w-px bg-white/10" />
            
            <div className="flex items-center gap-10">
               {session ? (
                 <Link href="/dashboard" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-[#C8FF00] transition-colors">Registry</Link>
               ) : (
                 <Link href="/login" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-[#C8FF00] transition-colors italic">Sign In</Link>
               )}
               <Link href="/poojas" className="bg-white text-black px-8 py-2.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#C8FF00] transition-colors">
                  Reserve
               </Link>
            </div>
          </nav>

          {/* Radical Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-4 md:hidden group z-[110]"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span className={`w-6 h-px bg-white transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-1' : ''}`} />
              <span className={`w-6 h-px bg-white transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Radical Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0D0D0D] z-[90] flex flex-col justify-center px-12 pt-20"
          >
            <p className="font-mono text-[9px] text-[#C8FF00] mb-16 tracking-[0.5em] font-black uppercase opacity-40">Archive Index</p>
            <nav className="flex flex-col gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-serif text-6xl text-white italic hover:text-[#C8FF00] transition-all duration-500 tracking-tighter"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pb-16 flex flex-col gap-12">
               <Link href="/poojas" className="bg-white text-black text-center py-6 font-mono text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#C8FF00] transition-colors">
                 Initiate Ritual
               </Link>
               <div className="flex justify-between font-mono text-[8px] text-white/20 tracking-[0.4em] uppercase">
                  <span>{session ? "Secunderabad / TS" : "Sree Muthappan"}</span>
                  <span>© 2026 Registry</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
