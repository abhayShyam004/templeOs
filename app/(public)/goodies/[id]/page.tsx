import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseGallery } from "@/lib/temple-data";
import { DetailAddToCart } from "@/components/temple/detail-add-to-cart";
import { ProductDetailPage } from "@/components/temple/product-detail-page";

export default async function GoodieDetailPage({ params }: { params: { id: string } }) {
  const item = await db.goodieItem.findUnique({ where: { id: params.id } });

  if (item == null || item.inStock === false) {
    notFound();
  }

  const gallery = Array.from(new Set([item.image, ...parseGallery(item.gallery)])).slice(0, 5);

  return (
    <ProductDetailPage
      backHref="/goodies"
      backLabel="Back to Goodies"
      eyebrow="Temple Goodie"
      title={item.name}
      description={item.description}
      price={item.price}
      gallery={gallery}
      facts={[
        { label: "Availability", value: item.inStock ? "Ready to purchase" : "Out of stock" },
        { label: "Catalog Order", value: item.sortOrder != null ? String(item.sortOrder) : "Default order" },
        { label: "Main Image", value: item.image },
        { label: "Gallery Images", value: String(Math.max(0, gallery.length - 1)) },
      ]}
      aside={
        <>
          <DetailAddToCart
            id={item.id}
            image={item.image}
            name={item.name}
            price={item.price}
            type="goodie"
          />
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-lg">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/55">Catalog Notes</p>
            <p className="mt-4 text-sm leading-7 text-black/70">
              This page reflects the admin-maintained product description, current pricing, gallery, and stock visibility for the item.
            </p>
          </div>
        </>
      }
    />
  );
}
