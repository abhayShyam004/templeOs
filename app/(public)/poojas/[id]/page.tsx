import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import { db } from "@/lib/db";
import { parseGallery } from "@/lib/temple-data";
import { BookingForm } from "@/components/forms/booking-form";

export default async function PoojaDetailPage({ params }: { params: { id: string } }) {
  const pooja = await db.pooja.findUnique({ where: { id: params.id } });
  if (pooja == null || pooja.available === false) {
    notFound();
  }

  const gallery = [pooja.image, ...parseGallery(pooja.gallery)].slice(0, 4);

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-12 md:px-8 md:py-16">
      <div className="rounded-2xl border border-black/30 bg-white p-5 shadow-lg md:col-span-7 md:p-6">
        <Link href="/poojas" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/60 hover:text-black">
          <ArrowLeft size={14} /> Back
        </Link>
        <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">{pooja.name}</h1>
        <p className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/60"><Clock3 size={14} /> {pooja.duration}</p>
        <p className="mt-6 text-base leading-relaxed text-black/80">{pooja.description}</p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {gallery.map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt={pooja.name} className="h-48 w-full rounded-2xl border border-black/15 object-cover" />
          ))}
        </div>
      </div>

      <aside className="md:col-span-5 md:sticky md:top-28">
        <div className="rounded-2xl border border-black/30 bg-white p-6 shadow-lg">
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/60">Booking Contribution</p>
          <p className="mt-2 font-serif text-4xl">INR {pooja.price}</p>
          <p className="mt-2 text-sm text-black/75">Login is requested only when you submit this form.</p>
          <div className="mt-6 border-t border-black/15 pt-6">
            <BookingForm pooja={pooja} />
          </div>
        </div>
      </aside>
    </section>
  );
}
