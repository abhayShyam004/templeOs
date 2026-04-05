import { db } from "@/lib/db";

export type CheckoutItemInput = {
  id: string;
  quantity: number;
  type: "prasadam" | "goodie";
};

export type NormalizedCheckoutItem = {
  id: string;
  quantity: number;
  type: "prasadam" | "goodie";
};

export type CheckoutPricing = {
  items: NormalizedCheckoutItem[];
  prasadamItems: NormalizedCheckoutItem[];
  goodieItems: NormalizedCheckoutItem[];
  totalPrasadAmount: number;
  totalGoodieAmount: number;
  totalAmount: number;
};

export function normalizeCheckoutItems(items: CheckoutItemInput[] | null | undefined) {
  return (items ?? []).flatMap((item) => {
    if (
      !item ||
      typeof item.id !== "string" ||
      (item.type !== "prasadam" && item.type !== "goodie")
    ) {
      return [];
    }

    const parsedQuantity = Number(item.quantity || 1);

    return [
      {
        id: item.id,
        type: item.type,
        quantity: Number.isFinite(parsedQuantity) ? Math.max(1, Math.trunc(parsedQuantity)) : 1,
      } satisfies NormalizedCheckoutItem,
    ];
  });
}

export async function getCheckoutPricing(items: CheckoutItemInput[] | null | undefined) {
  const normalizedItems = normalizeCheckoutItems(items);

  if (!normalizedItems.length) {
    throw new Error("No items in order");
  }

  const prasadamItems = normalizedItems.filter((item) => item.type === "prasadam");
  const goodieItems = normalizedItems.filter((item) => item.type === "goodie");

  let totalPrasadAmount = 0;
  let totalGoodieAmount = 0;

  if (prasadamItems.length > 0) {
    const ids = prasadamItems.map((item) => item.id);
    const catalog = await db.prasadItem.findMany({
      where: { id: { in: ids }, inStock: true },
      select: { id: true, price: true },
    });

    if (catalog.length !== ids.length) {
      throw new Error("One or more prasadam items are unavailable");
    }

    const priceMap = new Map(catalog.map((item) => [item.id, item.price]));
    totalPrasadAmount = prasadamItems.reduce(
      (sum, item) => sum + (priceMap.get(item.id) || 0) * item.quantity,
      0,
    );
  }

  if (goodieItems.length > 0) {
    const ids = goodieItems.map((item) => item.id);
    const catalog = await db.goodieItem.findMany({
      where: { id: { in: ids }, inStock: true },
      select: { id: true, price: true },
    });

    if (catalog.length !== ids.length) {
      throw new Error("One or more goodie items are unavailable");
    }

    const priceMap = new Map(catalog.map((item) => [item.id, item.price]));
    totalGoodieAmount = goodieItems.reduce(
      (sum, item) => sum + (priceMap.get(item.id) || 0) * item.quantity,
      0,
    );
  }

  return {
    items: normalizedItems,
    prasadamItems,
    goodieItems,
    totalPrasadAmount,
    totalGoodieAmount,
    totalAmount: totalPrasadAmount + totalGoodieAmount,
  } satisfies CheckoutPricing;
}
