import PublicMarketplace, { MarketplaceItem } from "@/components/temple/public-marketplace";
import { getOfferingDelegate } from "@/lib/offering-delegate";

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

  const offeringItems: MarketplaceItem[] = offeringsData.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    category: item.category,
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
      itemActionLabel="Offer Now"
      itemActionHrefPrefix="/cart"
      itemActionMode="add-to-cart"
      allowCart={false}
      showItemAction={false}
    />
  );
}
