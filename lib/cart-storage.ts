export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: "prasadam" | "goodie";
};

const CART_UPDATED_EVENT = "cart-updated";

export function getCartStorageKey(userKey: string | null | undefined): string {
  if (!userKey) return "temple-cart:guest";
  return `temple-cart:${userKey}`;
}

export function readStoredCart(storageKey: string): CartItem[] {
  if (typeof window === "undefined") return [];

  const rawValue = window.localStorage.getItem(storageKey);
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((item) => {
      if (
        !item ||
        typeof item.id !== "string" ||
        typeof item.name !== "string" ||
        typeof item.price !== "number" ||
        typeof item.image !== "string" ||
        typeof item.quantity !== "number" ||
        (item.type !== "prasadam" && item.type !== "goodie")
      ) {
        return [];
      }

      return [
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: Math.max(1, Math.trunc(item.quantity)),
          type: item.type,
        } satisfies CartItem,
      ];
    });
  } catch {
    return [];
  }
}

export function writeStoredCart(storageKey: string, items: CartItem[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(storageKey, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function getCartUpdatedEventName() {
  return CART_UPDATED_EVENT;
}
