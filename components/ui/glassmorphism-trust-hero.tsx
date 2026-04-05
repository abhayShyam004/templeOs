import React from "react";
import { 
  ArrowRight, 
  Play, 
  Target, 
  Crown, 
  Star,
  Zap,
  Shield,
  Heart,
  Flame,
  Sun,
  Moon,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";

// --- SACRED TRADITIONS ---
const TRADITIONS = [
  { name: "Thiruvappana", icon: Flame },
  { name: "Vellattam", icon: Sun },
  { name: "Karimkalasam", icon: Shield },
  { name: "Oottum Vellattam", icon: Heart },
  { name: "Vilakkum Mala", icon: Moon },
  { name: "Thulabharam", icon: Zap },
];

// --- MAIN COMPONENT ---
export default function HeroSection() {
  return (
    <div className="relative w-full bg-zinc-950 text-white overflow-hidden font-sans min-h-[100svh] flex flex-col">
      {/* 
        SCOPED ANIMATIONS 
      */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

      {/* --- TOP LEFT ANCHOR (OHMM) --- */}
      <div className="absolute top-10 left-10 z-30 animate-fade-in delay-100">
        <span className="text-5xl md:text-7xl font-serif text-[#C8FF00] select-none opacity-80">
          ॐ
        </span>
      </div>

      {/* Background Image with Gradient Mask */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/muthappan2.png')] bg-cover bg-center opacity-10 md:opacity-15 grayscale contrast-125 transition-opacity duration-1000"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
        }}
      />

      {/* --- MALAYALAM BACKGROUND TEXTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <span className="absolute top-[15%] left-[60%] text-[12vw] font-serif italic text-white opacity-[0.03] leading-none">
          മുത്തപ്പൻ
        </span>
        <span className="absolute top-[60%] left-[5%] text-[8vw] font-serif text-white opacity-[0.02] leading-none">
          മടപ്പുര
        </span>
        <span className="absolute top-[40%] right-[10%] text-[10vw] font-serif italic text-[#C8FF00] opacity-[0.02] leading-none">
          അഭയം
        </span>
        <span className="absolute bottom-[20%] left-[40%] text-[6vw] font-serif text-white opacity-[0.03] leading-none">
          ശ്രീ
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-32 sm:px-6 md:pt-20 md:pb-48 lg:px-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* --- CONTENT COLUMN --- */}
          <div className="lg:col-span-12 xl:col-span-11 flex flex-col justify-center space-y-8 md:space-y-10 pt-4 md:pt-8">
            
            {/* Heading - Refined Size & Hierarchy */}
            <h1 
              className="animate-fade-in delay-100 text-[clamp(2.5rem,10vw,8.5rem)] font-bold tracking-[-0.04em] uppercase leading-[0.82] md:leading-[0.8]"
              style={{
                maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)"
              }}
            >
              <span className="text-[0.28em] block mb-4 opacity-40 tracking-[0.4em] font-mono font-black">Sri</span>
              Muthappan<br />
              <span className="font-light italic tracking-[-0.02em] text-[#C8FF00] lowercase">
                Madapura
              </span><br />
              <span className="text-[0.4em] tracking-[0.1em] block mt-4 opacity-90">Indiranagar</span>
            </h1>

            {/* Description */}
            <p className="animate-fade-in delay-200 max-w-lg text-base md:text-lg text-zinc-400 leading-relaxed italic opacity-70">
              "Experience the divine presence and ancient traditions of North Malabar. 
              Connect with your roots through our sacred digital portal."
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in delay-300 flex flex-col sm:flex-row gap-4 md:gap-6 pt-4">
              <Link href="/poojas" className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-4 text-sm font-bold text-zinc-950 transition-all hover:scale-[1.05] hover:bg-[#C8FF00] active:scale-[0.98]">
                Book a Pooja
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link href="/prasadam" className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-10 py-4 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/10 hover:border-white/20">
                <ShoppingBag className="w-4 h-4 text-[#C8FF00]" />
                Book Prasadham
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* --- LOCATION BADGE (Bottom Right) --- */}
      <div className="absolute bottom-16 md:bottom-20 right-4 md:right-8 lg:right-12 z-30 animate-fade-in delay-500">
        <a 
          href="https://www.google.com/maps/search/?api=1&query=Sri+Muthappan+Madapura+Indiranagar+Hyderabad"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-end gap-1 group"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#666666] group-hover:text-zinc-400 transition-colors text-right">Archival Registry</p>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/2 px-5 py-2.5 backdrop-blur-xl transition-all group-hover:bg-[#C8FF00] group-hover:border-[#C8FF00]">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-zinc-300 group-hover:text-black flex items-center gap-4 transition-colors">
              Indiranagar · Hyderabad
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8FF00] opacity-75 group-hover:bg-black"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8FF00] group-hover:bg-black transition-colors"></span>
              </div>
            </span>
          </div>
        </a>
      </div>

      {/* --- FULL WIDTH MARQUEE STRIP --- */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="relative bg-[#C8FF00] py-3 md:py-4 overflow-hidden border-t border-white/5 shadow-[0_-20px_50px_rgba(200,255,0,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] z-10 pointer-events-none animate-[pulse_4s_ease-in-out_infinite]" />
          
          <div className="relative flex overflow-hidden">
            <div className="animate-marquee flex gap-16 md:gap-24 whitespace-nowrap items-center">
              {[...TRADITIONS, ...TRADITIONS, ...TRADITIONS, ...TRADITIONS, ...TRADITIONS].map((tradition, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-4 transition-all hover:scale-110 cursor-default group"
                >
                  <tradition.icon className="h-4 w-4 md:h-5 md:w-5 text-black" />
                  <span className="text-sm md:text-lg font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-black">
                    {tradition.name}
                  </span>
                  <span className="text-black/30 text-xl md:text-2xl font-serif">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
