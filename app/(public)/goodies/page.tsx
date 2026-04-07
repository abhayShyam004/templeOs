import { db } from "@/lib/db";
import PublicMarketplace, { MarketplaceItem } from "@/components/temple/public-marketplace";
import { getReviewSummaries } from "@/lib/reviews";
import { ReviewTargetType } from "@/lib/review-target-type";

export const dynamic = "force-dynamic";

export default async function GoodiesPage() {
  const itemsData = await db.goodieItem.findMany({
    where: { inStock: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  const reviewSummaries = await getReviewSummaries(
    ReviewTargetType.GOODIE,
    itemsData.map((item) => item.id),
  );

  const items: MarketplaceItem[] = itemsData.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    category: "Goodies",
    averageRating: reviewSummaries.get(p.id)?.averageRating ?? null,
    reviewCount: reviewSummaries.get(p.id)?.reviewCount ?? 0,
  }));

  return (
    <PublicMarketplace 
      items={items} 
      title="Goodies"
      subtitle="Muthappan artifacts and souvenirs."
      searchPlaceholder="Search for Goodies..."
      activeCategory="goodies"
      filterTitle="Goodies Filters"
      itemActionLabel="View Details"
      detailHrefPrefix="/goodies"
      itemActionMode="detail"
    />
  );
}
