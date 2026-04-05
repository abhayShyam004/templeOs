"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface MarqueeItem {
  id: string;
  text: string;
  link: string;
  active?: boolean;
}

const FALLBACK_ITEMS: MarqueeItem[] = [
  { id: "1", text: "Book Poojas", link: "/poojas" },
  { id: "2", text: "Fresh Prasadam Delivery", link: "/prasadam" },
  { id: "3", text: "Temple Goodies Collection", link: "/goodies" },
  { id: "4", text: "Sri Muthappan Madapura", link: "/" },
];

function RibbonTrack({
  items,
  direction,
  className,
  duration,
}: {
  items: MarqueeItem[];
  direction: "left" | "right";
  className: string;
  duration: number;
}) {
  const loopItems = useMemo(() => [...items, ...items, ...items, ...items], [items]);
  const animateX = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];

  return (
    <motion.div className={className} animate={{ x: animateX }} transition={{ duration, repeat: Infinity, ease: "linear" }}>
      {loopItems.map((item, index) => (
        <Link
          key={`${item.id}-${index}`}
          href={item.link || "/"}
          className="group pointer-events-auto flex shrink-0 items-center gap-6 px-6 md:gap-8 md:px-10"
        >
          <span className="font-mono text-[12px] font-black uppercase tracking-[0.22em] text-black md:text-[16px]">
            {item.text}
          </span>
          <span className="text-xl text-black/45 transition-colors duration-300 group-hover:text-black">✦</span>
        </Link>
      ))}
    </motion.div>
  );
}

export function MarqueeStrip() {
  const [items, setItems] = useState<MarqueeItem[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchItems() {
      try {
        const res = await fetch("/api/admin/marquee", { cache: "no-store" });
        if (!res.ok) return;

        const data: unknown = await res.json();
        if (!Array.isArray(data)) return;

        const normalized = data
          .filter((item): item is MarqueeItem => {
            if (!item || typeof item !== "object") return false;
            const maybe = item as Partial<MarqueeItem>;
            return typeof maybe.id === "string" && typeof maybe.text === "string";
          })
          .filter((item) => item.active !== false)
          .map((item) => ({
            id: item.id,
            text: item.text,
            link: typeof item.link === "string" && item.link.length > 0 ? item.link : "/",
            active: item.active,
          }));

        if (mounted) setItems(normalized);
      } catch {
        // Keep fallback items on fetch failure.
      }
    }

    fetchItems();

    return () => {
      mounted = false;
    };
  }, []);

  const displayItems = items.length > 0 ? items : FALLBACK_ITEMS;

  return (
    <section className="pointer-events-none absolute inset-x-0 bottom-8 z-30 select-none md:bottom-10">
      <div className="relative w-full">
        <div className="absolute inset-x-4 top-1/2 h-12 -translate-y-1/2 rounded-full bg-black/35 blur-2xl md:h-16" />

        <div className="relative h-28 md:h-32">
          <div className="absolute -left-14 -right-4 top-3 rotate-[8deg] overflow-hidden border-2 border-black/30 bg-gradient-to-r from-[#d8ff4f] via-[#e9ff93] to-[#c8ff00] py-5 shadow-[0_18px_36px_rgba(0,0,0,0.4)] md:-left-16 md:-right-6 md:py-6">
            <RibbonTrack
              items={displayItems}
              direction="left"
              duration={24}
              className="flex w-max items-center whitespace-nowrap"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
