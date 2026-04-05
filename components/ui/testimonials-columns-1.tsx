"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; name: string; role: string; rating?: number }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, name, role, rating = 5 }, i) => (
                <div className="p-8 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-lg shadow-primary/5 max-w-xs w-full" key={i}>
                  <div className="flex gap-0.5 mb-4 text-secondary">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm leading-relaxed text-muted-foreground italic">&quot;{text}&quot;</div>
                  <div className="flex flex-col mt-6">
                    <div className="font-medium tracking-tight leading-tight text-foreground">{name}</div>
                    <div className="text-xs opacity-60 tracking-tight text-muted-foreground">{role}</div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
