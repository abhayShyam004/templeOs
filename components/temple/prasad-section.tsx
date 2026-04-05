"use client";

import React from 'react';
import Link from 'next/link';

const prasadItems = [
  {
    name: "Kadala Prasad",
    nameML: "കടല പ്രസാദം",
    desc: "Sacred black chickpeas prepared with temple spices, blessed at dawn.",
    price: 150,
    image: "/muthappan.png"
  },
  {
    name: "Sacred Coconut",
    nameML: "തിരുനാളി",
    desc: "Whole coconut blessed at the sanctum, returned as divine grace.",
    price: 80,
    image: "/muthappan2.png"
  }
];

export function PrasadSection() {
  return (
    <section className="relative py-40 px-8 bg-[var(--c-bg)]" id="prasad">
      <div className="max-w-screen-2xl mx-auto">
        
        <div className="flex flex-col lg:flex-row justify-between items-end mb-32 gap-12">
           <div className="max-w-2xl">
              <p className="label-mono mb-8 text-[var(--c-accent)]">BLESSED OFFERINGS</p>
              <h2 className="display-serif text-[clamp(3rem,8vw,6rem)] leading-none">
                Taste of the <br />
                <span className="italic">Sanctum.</span>
              </h2>
           </div>
           <div className="text-right">
              <p className="body-text italic text-[var(--c-text-muted)] max-w-xs mb-8">
                Every item is prepared daily within the temple premises following sacred recipes.
              </p>
              <Link href="/prasadam" className="btn-sacred">View All</Link>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
           {prasadItems.map((item, i) => (
             <div key={item.name} className={`relative flex flex-col ${i === 1 ? 'lg:pt-40' : ''}`}>
                
                {/* Item Image with Dynamic Mask */}
                <div 
                  className="relative w-full aspect-square overflow-hidden shadow-2xl group"
                  style={{ borderRadius: i % 2 === 0 ? '10rem 2rem 10rem 2rem' : '2rem 10rem 2rem 10rem' }}
                >
                   <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt={item.name} />
                   <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(var(--c-accent-rgb),0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Floating Meta Data Label */}
                <div className={`absolute ${i === 0 ? '-bottom-10 -right-10' : '-top-10 -left-10'} z-20 bg-[var(--c-text)] text-[var(--c-bg)] p-8 rounded-[3rem] shadow-2xl max-w-xs`}>
                   <p className="label-mono text-[var(--c-accent)] mb-2">PRASAD / 0{i+1}</p>
                   <h3 className="font-serif text-3xl italic mb-4">{item.name}</h3>
                   <p className="body-text text-sm opacity-60 mb-6 italic">{item.desc}</p>
                   <div className="flex items-center justify-between">
                      <span className="font-serif text-2xl">₹{item.price}</span>
                      <button className="label-mono border-b-2 border-[var(--c-accent)] hover:text-[var(--c-accent)] transition-all">Add to bag</button>
                   </div>
                </div>

             </div>
           ))}
        </div>

      </div>
    </section>
  );
}
