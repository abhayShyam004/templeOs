import { db } from "@/lib/db";
import PublicMarketplace, { MarketplaceItem } from "@/components/temple/public-marketplace";
import { getReviewSummaries } from "@/lib/reviews";
import { ReviewTargetType } from "@/lib/review-target-type";

export const dynamic = "force-dynamic";

export default async function PoojasPage() {
  const poojasData = await db.pooja.findMany({
    where: { available: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  const reviewSummaries = await getReviewSummaries(
    ReviewTargetType.POOJA,
    poojasData.map((pooja) => pooja.id),
  );

  const poojas: MarketplaceItem[] = poojasData.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    duration: p.duration,
    averageRating: reviewSummaries.get(p.id)?.averageRating ?? null,
    reviewCount: reviewSummaries.get(p.id)?.reviewCount ?? 0,
  }));

  return (
    <PublicMarketplace 
      items={poojas} 
      title="Poojas"
      subtitle="Book Poojas of Sri Muthappan Madappura and Kaali amma"
      searchPlaceholder="Search for Poojas..."
      activeCategory="poojas"
      filterTitle="Pooja Filters"
      itemActionLabel="View Details"
      detailHrefPrefix="/poojas"
      allowCart={false}
    />
  );
}
