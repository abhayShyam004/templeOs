import PublicMarketplace, { MarketplaceItem } from "@/components/temple/public-marketplace";
import { getOfferingDelegate } from "@/lib/offering-delegate";
import { getReviewSummaries } from "@/lib/reviews";
import { ReviewTargetType } from "@/lib/review-target-type";

export const dynamic = "force-dynamic";

type OfferingRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export default async function OfferingsPage() {
  const offeringItem = getOfferingDelegate();
  const offeringsData = (await offeringItem.findMany({
    where: { inStock: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })) as OfferingRow[];
  const reviewSummaries = await getReviewSummaries(
    ReviewTargetType.OFFERING,
    offeringsData.map((item) => item.id),
  );

  const offeringItems: MarketplaceItem[] = offeringsData.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    category: item.category,
    averageRating: reviewSummaries.get(item.id)?.averageRating ?? null,
    reviewCount: reviewSummaries.get(item.id)?.reviewCount ?? 0,
  }));

  const categories = [...new Set(offeringsData.map((item) => item.category).filter(Boolean))];

  return (
    <PublicMarketplace
      items={offeringItems}
      title="Sacred Offerings"
      subtitle="Browse and select temple offerings."
      searchPlaceholder="Search for offerings..."
      activeCategory="offerings"
      filterTitle="Offering Filters"
      categories={categories}
      itemActionLabel="View Details"
      detailHrefPrefix="/offerings"
      itemActionMode="detail"
      allowCart={false}
    />
  );
}
