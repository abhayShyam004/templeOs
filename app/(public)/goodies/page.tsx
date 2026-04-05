import { db } from "@/lib/db";
import PublicMarketplace, { MarketplaceItem } from "@/components/temple/public-marketplace";

export default async function GoodiesPage() {
  const itemsData = await db.goodieItem.findMany({
    where: { inStock: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const items: MarketplaceItem[] = itemsData.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    category: "Goodies"
  }));

  return (
    <PublicMarketplace 
      items={items} 
      title="Goodies"
      subtitle="Muthappan artifacts and souvenirs."
      searchPlaceholder="Search for Goodies..."
      activeCategory="goodies"
      filterTitle="Goodies Filters"
      itemActionLabel="Purchase"
      itemActionHrefPrefix="/cart"
      itemActionMode="add-to-cart"
    />
  );
}
