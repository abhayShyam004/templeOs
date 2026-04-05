"use client";

import React from "react";
import Link from "next/link";

export function StickyFooter() {
  const navItems = ["Traditions", "E-Darshan", "Blessed Prasad", "Identity"];
  const socialItems = ["Instagram", "Youtube", "Facebook"];

  return (
    <footer className="relative bg-[var(--c-text)] text-[var(--c-bg)] py-40 px-8 overflow-hidden">
      {/* Decorative Giant Seal Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[40vw] opacity-[0.02] pointer-events-none italic select-none">
        ശ്രീ
      </div>

      <div className="max-w-screen-2xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-40">
          <div className="lg:col-span-6">
            <p className="label-mono mb-12 text-[var(--c-accent)] tracking-[0.5em]">
              THE FINAL WORD
            </p>
            <h2 className="display-serif text-[clamp(3.5rem,10vw,8rem)] leading-none">
              Devotion is <br />
              <span className="italic">Timeless.</span>
            </h2>
            <div className="mt-20 flex gap-12 items-center">
              <div className="w-20 h-20 rounded-full border border-[var(--c-accent)] flex items-center justify-center text-3xl">
                ॐ
              </div>
              <p className="body-text italic text-xl opacity-60">
                &quot;Connecting the lineage of Kunnathurpadi to every devotee&apos;s heart.&quot;
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 lg:pt-32">
            <p className="label-mono mb-8 opacity-40">NAVIGATION</p>
            <ul className="flex flex-col gap-6 list-none m-0 p-0 font-serif text-3xl italic">
              {navItems.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-[var(--c-accent)] transition-all hover:translate-x-4 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 lg:pt-32">
            <p className="label-mono mb-8 opacity-40">LOCATION</p>
            <p className="body-text italic text-2xl mb-12">
              Indira Nagar, Tirumalagiri <br />
              Secunderabad, TS 500015
            </p>
            <p className="label-mono text-[var(--c-accent)]">Help Desk</p>
            <p className="font-serif text-2xl mt-2">contact@muthappan.org</p>
          </div>
        </div>

        {/* Closing Stamp */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-12">
            <p className="label-mono text-[9px] opacity-40">ESTABLISHED 1982</p>
            <p className="label-mono text-[9px] opacity-40">KERALA HERITAGE</p>
          </div>
          <p className="label-mono text-[10px] opacity-20">
            © 2026 Sree Muthappan Temple — All rights reserved.
          </p>
          <div className="flex gap-8">
            {socialItems.map((s) => (
              <Link
                key={s}
                href="#"
                className="label-mono text-[10px] hover:text-[var(--c-accent)] transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
