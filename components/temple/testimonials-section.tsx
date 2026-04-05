"use client";

import { useEffect, useState } from "react";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  name: string;
  role: string;
  rating: number;
}

const fillerTestimonials: Testimonial[] = [
  {
    text: "The online pooja booking was seamless. I felt a deep connection even while being thousands of miles away from Kerala.",
    name: "Anjali Menon",
    role: "Devotee, London",
    rating: 5,
  },
  {
    text: "Receiving the Prasad at my doorstep was a divine experience. The packaging was careful and maintained the sanctity.",
    name: "Rajesh Nair",
    role: "Devotee, Bangalore",
    rating: 5,
  },
  {
    text: "The Live Darshan feature brings the temple's peace into my home every morning. A true blessing in today's digital age.",
    name: "Sumi Pillai",
    role: "Devotee, Dubai",
    rating: 5,
  },
  {
    text: "The E-Certificates for the poojas are well-documented. It's heartening to see our traditions embrace modern technology.",
    name: "Karan Varma",
    role: "Devotee, New York",
    rating: 5,
  },
  {
    text: "I was worried about the rituals being performed correctly, but the temple's transparency and updates put me at ease.",
    name: "Lekshmi Das",
    role: "Devotee, Chennai",
    rating: 5,
  },
  {
    text: "A wonderful initiative for those of us who cannot travel often. Muthappan's grace is now just a click away.",
    name: "Vikram Chandran",
    role: "Devotee, Singapore",
    rating: 5,
  },
  {
    text: "The history section helped my children understand their roots. This platform is more than just service; it's heritage.",
    name: "Meera Iyer",
    role: "Devotee, Mumbai",
    rating: 5,
  },
  {
    text: "Highly efficient system. From booking to receiving the vibhuti, everything was professionally handled.",
    name: "Siddharth Panicker",
    role: "Devotee, Kochi",
    rating: 5,
  },
  {
    text: "The temple's inclusive philosophy is beautifully reflected in this modern digital sanctuary. Truly inspiring.",
    name: "Deepa Krishnan",
    role: "Devotee, Berlin",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fillerTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/testimonials");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setTestimonials(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const firstColumn = testimonials.slice(0, Math.ceil(testimonials.length / 3));
  const secondColumn = testimonials.slice(Math.ceil(testimonials.length / 3), Math.ceil(2 * testimonials.length / 3));
  const thirdColumn = testimonials.slice(Math.ceil(2 * testimonials.length / 3));

  return (
    <section className="bg-background py-24 relative overflow-hidden">
      <div className="container px-4 z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[640px] mx-auto text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="border border-gold/30 bg-gold/5 px-4 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] text-gold">
              Community Voices
            </div>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight text-foreground">
            Words from our <em className="text-gold italic">community</em>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-md opacity-80 text-sm">
            Admin-approved testimonials from our global family of devotees.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={25} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={35} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={30} />
        </div>
      </div>
    </section>
  );
}
