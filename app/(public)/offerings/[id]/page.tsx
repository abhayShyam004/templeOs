import { notFound } from "next/navigation";
import { getOfferingDelegate } from "@/lib/offering-delegate";
import { parseGallery } from "@/lib/temple-data";
import { ProductDetailPage } from "@/components/temple/product-detail-page";

type OfferingRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  gallery: string;
  sortOrder: number | null;
  inStock: boolean;
};

export default async function OfferingDetailPage({ params }: { params: { id: string } }) {
  const offeringItem = getOfferingDelegate();
  const item = (await offeringItem.findUnique({ where: { id: params.id } })) as OfferingRow | null;

  if (item == null || item.inStock === false) {
    notFound();
  }

  const gallery = Array.from(new Set([item.image, ...parseGallery(item.gallery)])).slice(0, 5);

  return (
    <ProductDetailPage
      backHref="/offerings"
      backLabel="Back to Offerings"
      eyebrow="Temple Offering"
      title={item.name}
      subtitle={item.category}
      description={item.description}
      price={item.price}
      gallery={gallery}
      facts={[
        { label: "Category", value: item.category },
        { label: "Availability", value: item.inStock ? "Currently available" : "Unavailable" },
        { label: "Catalog Order", value: item.sortOrder != null ? String(item.sortOrder) : "Default order" },
        { label: "Main Image", value: item.image },
      ]}
      aside={
        <>
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-lg">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/60">Offering Value</p>
            <p className="mt-2 font-serif text-4xl">INR {item.price}</p>
            <p className="mt-4 text-sm leading-7 text-black/70">
              This offering is now presented with a full detail page. If you want, the next step can be adding a dedicated checkout flow for offerings too.
            </p>
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-lg">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/55">Catalog Notes</p>
            <p className="mt-4 text-sm leading-7 text-black/70">
              The category, description, gallery, and price shown here come directly from the admin-filled offering record.
            </p>
          </div>
        </>
      }
    />
  );
}
