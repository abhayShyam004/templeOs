import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ScrollText, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type DetailFact = {
  label: string;
  value: string;
};

type ProductDetailPageProps = {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  subtitle?: string | null;
  description: string;
  price: number;
  gallery: string[];
  facts: DetailFact[];
  aside: ReactNode;
};

export function ProductDetailPage({
  backHref,
  backLabel,
  eyebrow,
  title,
  subtitle,
  description,
  price,
  gallery,
  facts,
  aside,
}: ProductDetailPageProps) {
  const heroImage = gallery[0];
  const supportingImages = gallery.slice(1, 5);

  return (
    <section className="pb-16 pt-2 text-on-surface">
      <nav className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-on-surface-variant">
        <Link href={backHref} className="transition hover:text-on-surface">
          {backLabel.replace(/^Back to\s+/i, "")}
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <span className="text-on-surface">{title}</span>
      </nav>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:items-start">
        <div className="space-y-4">
          <div className="group relative overflow-hidden rounded-[2rem] border border-outline-variant bg-surface shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent" />
            <img
              src={heroImage}
              alt={title}
              className="aspect-square w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          </div>

          {supportingImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {supportingImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-[1.35rem] border border-outline-variant bg-surface"
                >
                  <img src={image} alt={`${title} view ${index + 2}`} className="aspect-[4/3] w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-6 xl:sticky xl:top-28">
          <div className="overflow-hidden rounded-[2rem] border border-[#f4d7d3] bg-[#fffaf8] text-[#211a1a] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <div className="bg-[linear-gradient(135deg,rgba(255,118,108,0.14),rgba(255,255,255,0))] px-6 pb-8 pt-6 md:px-8">
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7a4e47] transition hover:text-[#211a1a]"
              >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Link>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.26em] text-[#c1493f]">{eyebrow}</p>
              <h1 className="mt-4 font-headline text-4xl font-extrabold leading-none tracking-tight md:text-5xl">
                {title}
              </h1>
              {subtitle ? <p className="mt-4 text-base font-medium text-[#6b5450] md:text-lg">{subtitle}</p> : null}

              <div className="mt-8 flex flex-wrap items-end gap-4">
                <div className="text-5xl font-extrabold leading-none tracking-tight">{formatCurrency(price)}</div>
                <p className="pb-1 text-sm font-semibold text-[#944a00]">
                  Inclusive of the configured offering amount
                </p>
              </div>

              <p className="mt-8 text-base leading-8 text-[#4f403d] md:text-lg">{description}</p>
            </div>
          </div>

          {aside ? <div className="space-y-4">{aside}</div> : null}
        </div>
      </div>

      {facts.length > 0 ? (
        <div className="mt-16 grid gap-8 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <div className="overflow-hidden rounded-[2rem] border border-outline-variant bg-surface text-on-surface shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <div className="border-b border-outline-variant px-6 py-6 md:px-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Temple Notes</p>
              <h2 className="mt-3 font-headline text-3xl font-extrabold leading-none tracking-tight md:text-4xl">
                Details for this product or service
              </h2>
            </div>
            <div className="space-y-6 px-6 py-6 md:px-8">
              <div className="flex items-start gap-4">
                <ScrollText className="mt-1 h-5 w-5 text-secondary" />
                <p className="text-sm leading-7 text-on-surface-variant">
                  The title, description, gallery, price, and facts on this page come directly from the catalog records configured in the app.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <Sparkles className="mt-1 h-5 w-5 text-secondary" />
                <p className="text-sm leading-7 text-on-surface-variant">
                  This shared layout now covers product and service detail routes so prasadam, goodies, offerings, and poojas all follow the same presentation system.
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-outline-variant bg-surface-container-low px-5 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">Current Item</p>
                <p className="mt-3 text-lg font-semibold text-on-surface">{title}</p>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">{description}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-[1.75rem] border border-[#f1ddda] bg-[#fffaf8] p-6 text-[#211a1a] shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8d706a]">{fact.label}</p>
                <p className="mt-4 text-xl font-bold leading-8 tracking-tight">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
