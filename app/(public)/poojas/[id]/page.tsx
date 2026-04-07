import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseGallery } from "@/lib/temple-data";
import { BookingForm } from "@/components/forms/booking-form";
import { ProductDetailPage } from "@/components/temple/product-detail-page";

export default async function PoojaDetailPage({ params }: { params: { id: string } }) {
  const pooja = await db.pooja.findUnique({ where: { id: params.id } });

  if (pooja == null || pooja.available === false) {
    notFound();
  }

  const gallery = Array.from(new Set([pooja.image, ...parseGallery(pooja.gallery)])).slice(0, 5);

  return (
    <ProductDetailPage
      backHref="/poojas"
      backLabel="Back to Poojas"
      eyebrow="Temple Pooja"
      title={pooja.name}
      subtitle={pooja.nameML}
      description={pooja.description}
      price={pooja.price}
      gallery={gallery}
      facts={[
        { label: "Malayalam Name", value: pooja.nameML },
        { label: "Duration", value: pooja.duration },
        { label: "Availability", value: pooja.available ? "Open for booking" : "Unavailable" },
        { label: "Description (Malayalam)", value: pooja.descriptionML },
      ]}
      aside={
        <>
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-lg">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/60">Booking Contribution</p>
            <p className="mt-2 font-serif text-4xl">INR {pooja.price}</p>
            <p className="mt-2 text-sm leading-6 text-black/75">
              Choose the devotee details, booking date, and prasadam delivery preference before payment.
            </p>
            <div className="mt-6 border-t border-black/15 pt-6">
              <BookingForm pooja={pooja} />
            </div>
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-lg">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/55">What this page shows</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-black/70">
              <li>Every field visible here comes from the admin catalog entry for this pooja.</li>
              <li>Booking continues with the live payment and confirmation flow already in this app.</li>
            </ul>
          </div>
        </>
      }
    />
  );
}
