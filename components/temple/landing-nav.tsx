"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

export function LandingNav() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Poojas", href: "/poojas" },
    { name: "Live Darshan", href: "/darshan" },
    { name: "Blessed Prasadam", href: "/prasadam" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled ? 'py-4 px-8' : 'py-10 px-12'}`}>
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          
          {/* Typographic Logo / Seal */}
          <Link href="/" className="relative group">
            <div className="flex flex-col items-center">
               <span className="font-serif text-3xl leading-none text-[var(--c-text)] group-hover:text-[var(--c-accent)] transition-colors">ശ്രീ</span>
               <span className="label-mono text-[8px] opacity-40 -mt-1 tracking-[0.4em]">Muthappan</span>
            </div>
            {/* Red Vermillion Dot */}
            <div className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-[var(--c-accent)]" />
          </Link>

          {/* Minimal Floating Nav */}
          <div className="hidden md:flex items-center gap-16 bg-white/40 backdrop-blur-xl border border-[var(--c-border-strong)] rounded-full px-10 py-3 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="label-mono text-[var(--c-text)] hover:text-[var(--c-accent)] transition-all relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--c-accent)] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-6">
            <Link href={session ? "/dashboard" : "/login"} className="label-mono hidden md:block hover:text-[var(--c-accent)]">
              {session ? "Dashboard" : "Identity"}
            </Link>
            <button 
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 rounded-full border border-[var(--c-border-strong)] flex items-center justify-center hover:bg-[var(--c-text)] hover:text-[var(--c-bg)] transition-all"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Sacred Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[var(--c-bg)] z-[300] flex items-center justify-center p-12"
          >
            <button 
              className="absolute top-12 right-12 p-4 border border-[var(--c-border-strong)] rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X size={32} />
            </button>
            
            <div className="text-center">
               <p className="label-mono mb-12 opacity-40">Choose your path</p>
               <nav className="flex flex-col gap-12">
                 {navLinks.map((link) => (
                   <Link
                     key={link.name}
                     href={link.href}
                     onClick={() => setIsOpen(false)}
                     className="font-serif text-[clamp(3.5rem,12vw,8rem)] leading-none text-[var(--c-text)] hover:text-[var(--c-accent)] transition-all italic hover:tracking-widest"
                   >
                     {link.name}
                   </Link>
                 ))}
               </nav>
            </div>

            <div className="absolute bottom-12 left-12 right-12 flex justify-between border-t border-[var(--c-border)] pt-8">
               <p className="label-mono">{session ? "Indira Nagar / Secunderabad" : "Sree Muthappan"}</p>
               <p className="label-mono">ॐ Namah Shivaya</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
