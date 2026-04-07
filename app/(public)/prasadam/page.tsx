import { db } from "@/lib/db";
import PublicMarketplace, { MarketplaceItem } from "@/components/temple/public-marketplace";
import { getReviewSummaries } from "@/lib/reviews";
import { ReviewTargetType } from "@/lib/review-target-type";

export const dynamic = "force-dynamic";

export default async function PrasadamPage() {
  const itemsData = await db.prasadItem.findMany({
    where: { inStock: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  const reviewSummaries = await getReviewSummaries(
    ReviewTargetType.PRASADAM,
    itemsData.map((item) => item.id),
  );

  const items: MarketplaceItem[] = itemsData.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    grams: p.grams ?? undefined,
    category: "Prasadam",
    averageRating: reviewSummaries.get(p.id)?.averageRating ?? null,
    reviewCount: reviewSummaries.get(p.id)?.reviewCount ?? 0,
  }));

  return (
    <PublicMarketplace 
      items={items} 
      title="Temple Prasadam"
      subtitle="Temples offerings prepared traditionaly."
      searchPlaceholder="Search for Prasadam..."
      activeCategory="prasadam"
      filterTitle="Prasadam Filters"
      itemActionLabel="View Details"
      detailHrefPrefix="/prasadam"
      itemActionMode="detail"
    />
  );
}
