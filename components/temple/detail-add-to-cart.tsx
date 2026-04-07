"use client";

import { useState } from "react";
import { ArrowRight, ShoppingBag, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { getCartStorageKey, readStoredCart, writeStoredCart } from "@/lib/cart-storage";
import { formatCurrency } from "@/lib/utils";

type DetailAddToCartProps = {
  id: string;
  image: string;
  name: string;
  price: number;
  type: "prasadam" | "goodie";
  grams?: number;
  variant?: "default" | "minimal";
};

export function DetailAddToCart({
  id,
  image,
  name,
  price,
  type,
  grams,
  variant = "default",
}: DetailAddToCartProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);

  const sessionUserId =
    (session?.user as { id?: string; email?: string } | undefined)?.id ?? session?.user?.email ?? null;

  const syncCartAndNavigate = (destination: "/cart" | "/cart/checkout") => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    const cartStorageKey = getCartStorageKey(sessionUserId);
    const cart = readStoredCart(cartStorageKey);
    const existing = cart.find((item) => item.id === id);

    if (existing) {
      existing.quantity += quantity;
      if (typeof grams === "number") {
        existing.grams = grams;
      }
    } else {
      cart.push({
        id,
        image,
        name,
        price,
        quantity,
        type,
        grams,
      });
    }

    writeStoredCart(cartStorageKey, cart);
    router.push(destination);
  };

  const addToCart = () => {
    syncCartAndNavigate("/cart");
  };

  const buyNow = () => {
    syncCartAndNavigate("/cart/checkout");
  };

  if (variant === "minimal") {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-[#f4d7d3] bg-[#fffaf8] text-[#211a1a] shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
        <div className="bg-[linear-gradient(135deg,rgba(255,118,108,0.12),rgba(255,255,255,0))] px-5 pb-5 pt-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8d706a]">Quantity</p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center rounded-[1rem] border border-[#efd8d4] bg-white p-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-[0.8rem] bg-[#fff5f3] text-lg font-bold text-[#c1493f] transition hover:bg-[#fff1ef]"
                aria-label={`Decrease quantity for ${name}`}
              >
                -
              </button>
              <div className="min-w-[3rem] text-center text-lg font-extrabold leading-none">{quantity}</div>
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-[0.8rem] bg-[#fff5f3] text-lg font-bold text-[#c1493f] transition hover:bg-[#fff1ef]"
                aria-label={`Increase quantity for ${name}`}
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={addToCart}
              className="group flex w-full items-center justify-center gap-2 rounded-[1rem] border border-[#efd8d4] bg-white px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#211a1a] shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:bg-[#fff1ef]"
            >
              <ShoppingCart className="h-3.5 w-3.5 text-[#c1493f] transition group-hover:scale-110" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={buyNow}
              className="group flex w-full items-center justify-center gap-1.5 rounded-[1rem] bg-[linear-gradient(135deg,#ff766c,#f45d48)] px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(244,93,72,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(244,93,72,0.28)]"
            >
              <ShoppingBag className="h-3.5 w-3.5 transition group-hover:scale-110" />
              Buy Now
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-[#f4d7d3] bg-[#fffaf8] p-6 text-[#211a1a] shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8d706a]">Order Summary</p>
      <h3 className="mt-3 font-headline text-2xl font-extrabold tracking-tight">{name}</h3>
      <p className="mt-3 text-4xl font-extrabold leading-none">{formatCurrency(price)}</p>
      <p className="mt-2 text-sm leading-6 text-[#6b5450]">
        {typeof grams === "number"
          ? `${grams}g packed prasadam portion prepared for each quantity selected.`
          : type === "goodie"
            ? "Temple goodie ready for purchase through the shared cart flow."
            : "Temple catalog item ready for cart checkout."}
      </p>

      <div className="mt-6">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8d706a]">Quantity</p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-[#efd8d4] bg-white px-3 py-2">
        <button
          type="button"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-[#c1493f] transition hover:bg-[#fff1ef]"
        >
          -
        </button>
        <span className="min-w-8 text-center text-sm font-black">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((current) => current + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-[#c1493f] transition hover:bg-[#fff1ef]"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={addToCart}
        className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#ff766c] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:brightness-110"
      >
        Add to Cart
      </button>

      <button
        type="button"
        onClick={buyNow}
        className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#efd8d4] bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#211a1a] transition hover:bg-[#fff1ef]"
      >
        Buy Now
      </button>

      <div className="mt-5 grid gap-3 border-t border-[#efd8d4] pt-5 sm:grid-cols-2">
        <div className="rounded-[1rem] bg-white px-4 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8d706a]">Flow</p>
          <p className="mt-2 text-sm font-medium text-[#211a1a]">Stored in your devotee cart</p>
        </div>
        <div className="rounded-[1rem] bg-white px-4 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8d706a]">Type</p>
          <p className="mt-2 text-sm font-medium capitalize text-[#211a1a]">{type}</p>
        </div>
      </div>
    </div>
  );
}
