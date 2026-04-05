import { db } from "@/lib/db";
import PublicMarketplace, { MarketplaceItem } from "@/components/temple/public-marketplace";

export default async function PoojasPage() {
  const poojasData = await db.pooja.findMany({
    where: { available: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const poojas: MarketplaceItem[] = poojasData.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    duration: p.duration,
    category: "Rituals" // Example category
  }));

  return (
    <PublicMarketplace 
      items={poojas} 
      title="Poojas"
      subtitle="Book Poojas of Sri Muthappan Madappura and Kaali amma"
      searchPlaceholder="Search for Poojas..."
      activeCategory="poojas"
      filterTitle="Pooja Filters"
      categories={["Weekly Poojas", "Special Occasions", "Festival Poojas"]}
      itemActionLabel="Book Now"
      itemActionHrefPrefix="/poojas"
    />
  );
}
