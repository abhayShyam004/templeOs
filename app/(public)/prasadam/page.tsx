import { db } from "@/lib/db";
import PublicMarketplace, { MarketplaceItem } from "@/components/temple/public-marketplace";

export default async function PrasadamPage() {
  const itemsData = await db.prasadItem.findMany({
    where: { inStock: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const items: MarketplaceItem[] = itemsData.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    category: "Prasadam"
  }));

  return (
    <PublicMarketplace 
      items={items} 
      title="Temple Prasadam"
      subtitle="Temples offerings prepared traditionaly."
      searchPlaceholder="Search for Prasadam..."
      activeCategory="prasadam"
      filterTitle="Prasadam Filters"
      itemActionLabel="Order Now"
      itemActionHrefPrefix="/cart"
      itemActionMode="add-to-cart"
    />
  );
}
