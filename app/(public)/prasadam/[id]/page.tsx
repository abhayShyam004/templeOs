import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseGallery } from "@/lib/temple-data";
import { DetailAddToCart } from "@/components/temple/detail-add-to-cart";
import { ProductDetailPage } from "@/components/temple/product-detail-page";

export default async function PrasadamDetailPage({ params }: { params: { id: string } }) {
  const item = await db.prasadItem.findUnique({ where: { id: params.id } });

  if (item == null || item.inStock === false) {
    notFound();
  }

  const gallery = Array.from(new Set([item.image, ...parseGallery(item.gallery)])).slice(0, 5);

  return (
    <ProductDetailPage
      backHref="/prasadam"
      backLabel="Back to Prasadam"
      eyebrow="Temple Prasadam"
      title={item.name}
      subtitle={item.nameML}
      description={item.description}
      price={item.price}
      gallery={gallery}
      facts={[]}
      aside={
        <DetailAddToCart
          id={item.id}
          image={item.image}
          name={item.name}
          price={item.price}
          type="prasadam"
          grams={item.grams ?? undefined}
          variant="minimal"
        />
      }
    />
  );
}
