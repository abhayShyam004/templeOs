import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Pooja {
  id: string;
  name: string;
  nameML: string;
  description: string;
  slug: string;
  price: number;
  duration: string;
  image: string;
  available: boolean;
}

export function PoojaCard({ pooja }: { pooja: Pooja }) {
  return (
    <div className="group relative flex flex-col bg-white overflow-visible">
      {/* Divine Aura Background — Subtly pulses on card hover */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
         <div className="w-[80%] aspect-square bg-[rgba(var(--c-accent-rgb),0.05)] blur-[60px] rounded-full animate-pulse" />
      </div>

      {/* Visual Component — Unboxed Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-stone-50 transition-all duration-700">
        <img
          src={pooja.image || "/muthappan.png"}
          alt={pooja.name}
          className="h-full w-full object-contain grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
        />
        
        {/* Floating Metadata Seal */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
           <span className={cn(
             "label-mono px-4 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-[8px] font-black border border-black/5",
             !pooja.available && "opacity-50"
           )}>
             {pooja.available ? "ACTIVE TRADITION" : "SYSTEM STANDBY"}
           </span>
        </div>
      </div>

      {/* Content Component — Editorial Layout */}
      <div className="py-10 flex flex-col flex-grow">
        <div className="mb-8 flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="display-serif text-4xl md:text-5xl leading-[0.9] group-hover:italic transition-all duration-500">
              {pooja.name}
            </h3>
            <p className="font-serif text-[var(--c-accent)] text-lg italic mt-2 opacity-60">
              {pooja.nameML}
            </p>
          </div>
          <div className="pt-2">
             <span className="label-mono text-[var(--c-accent)] opacity-20 group-hover:opacity-100 transition-opacity text-xl">
               ॐ
             </span>
          </div>
        </div>

        <p className="body-text text-base italic opacity-40 mb-10 line-clamp-2 leading-relaxed">
          "{pooja.description}"
        </p>

        <div className="mt-auto pt-10 border-t border-black/5 flex items-end justify-between">
           <div className="flex flex-col gap-1">
             <p className="label-mono text-[8px] opacity-30 tracking-[0.3em]">CONTRIBUTION</p>
             <div className="font-serif text-3xl text-[var(--c-text)]">
               {formatCurrency(pooja.price)}
             </div>
           </div>
           
           <Link
             href={`/poojas/${pooja.id}`}
             className={cn(

               "btn-ritual py-4 px-10 text-[9px]",
               !pooja.available && "pointer-events-none opacity-20 grayscale"
             )}
           >
             RESERVE SLOT
           </Link>
        </div>
      </div>
    </div>
  );
}
