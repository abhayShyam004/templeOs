import React from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center mx-auto' : ''}`}>
      <div className={`flex items-center gap-3 mb-6 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="w-10 h-[1.5px] bg-[var(--c-accent)] opacity-40 rounded-full" />
        <p className="label-mono font-bold text-[var(--c-accent)] tracking-[0.3em]">{eyebrow}</p>
      </div>
      <h2 className={`display-serif text-[clamp(2.5rem,5.5vw,4.5rem)] text-[var(--c-text)] mb-6 ${align === 'center' ? 'max-w-4xl mx-auto' : 'max-w-2xl'}`}>
        {title.split(' ').map((word, i) => (
          <span key={i} className={i % 2 === 1 ? 'italic text-[var(--c-accent)]' : ''}>
            {word}{' '}
          </span>
        ))}
      </h2>
      <p className={`body-text text-[var(--c-text-muted)] text-[var(--t-lg)] ${align === 'center' ? 'mx-auto' : ''}`}>
        {description}
      </p>
    </div>
  );
}
