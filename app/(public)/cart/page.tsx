"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, Package, ShieldCheck, Truck } from "lucide-react";
import { PublicFooter } from "@/components/temple/public-footer";
import { formatCurrency } from "@/lib/utils";
import {
  CartItem,
  getCartStorageKey,
  getCartUpdatedEventName,
  readStoredCart,
  writeStoredCart,
} from "@/lib/cart-storage";

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionUserId = (session?.user as { id?: string; email?: string } | undefined)?.id ?? session?.user?.email ?? null;
  const cartStorageKey = getCartStorageKey(sessionUserId);
  const cartUpdatedEvent = getCartUpdatedEventName();

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated") {
      setLoading(false);
      router.replace("/login?callbackUrl=/cart");
      return;
    }

    const syncCart = () => {
      setItems(readStoredCart(cartStorageKey));
      setLoading(false);
    };

    syncCart();
    window.addEventListener(cartUpdatedEvent, syncCart);
    return () => window.removeEventListener(cartUpdatedEvent, syncCart);
  }, [status, router, cartStorageKey, cartUpdatedEvent]);

  const saveCart = (nextItems: CartItem[]) => {
    setItems(nextItems);
    writeStoredCart(cartStorageKey, nextItems);
  };

  const updateQuantity = (id: string, delta: number) => {
    saveCart(
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    saveCart(items.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );
  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );
  const containsPrasadam = items.some((item) => item.type === "prasadam");

  if (loading || status === "loading") return null;
  if (status !== "authenticated") return null;

  return (
    <div className="min-h-screen bg-[#f7f1eb] text-stone-900 flex flex-col overflow-x-hidden">
      <nav className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f7f1eb]/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="min-w-0">
            <Link href="/" className="text-lg font-black tracking-tight text-red-600 md:text-2xl font-headline">
              ശ്രീ Muthappa Madapura
            </Link>
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-stone-500">Cart Review</p>
          </div>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700 transition hover:bg-stone-50"
          >
            {session ? "Dashboard" : "Login"}
          </Link>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-8 md:py-10">
        <div className="grid gap-4 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-600">Step 1 of 2</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl font-headline">Review your cart before checkout.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
              Quantities, item mix, and contribution totals are confirmed here first. Delivery address and contact details move to the next step only after you proceed.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
            <InfoTile icon={<Package size={18} />} label="Items" value={`${totalItems} selected`} />
            <InfoTile icon={<Truck size={18} />} label="Delivery" value="Entered at checkout" />
            <InfoTile icon={<ShieldCheck size={18} />} label="Next Step" value="Address confirmation" />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-500">
              <Package size={28} />
            </div>
            <h2 className="mt-6 text-2xl font-black tracking-tight font-headline">Your cart is empty</h2>
            <p className="mt-3 text-sm text-stone-600">Add prasadam or devotional items first, then return here to continue.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/prasadam" className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700">
                Browse Prasadam
              </Link>
              <Link href="/goodies" className="rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-bold text-stone-800 transition hover:bg-stone-50">
                View Goodies
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_22rem] lg:items-start">
            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:p-5"
                >
                  <div className="overflow-hidden rounded-[1.25rem] bg-stone-100">
                    <img src={item.image} alt={item.name} className="h-28 w-full object-cover sm:h-full" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600">
                        {item.type === "prasadam" ? "Prasadam" : "Goodie"}
                      </span>
                      <span className="text-xs text-stone-500">Contribution per item {formatCurrency(item.price)}</span>
                    </div>
                    <h2 className="mt-3 text-xl font-black leading-tight font-headline">{item.name}</h2>
                    {item.type === "prasadam" && typeof item.grams === "number" ? (
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                        {item.grams}g per pack
                      </p>
                    ) : null}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-2 py-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="rounded-full px-3 py-1 text-lg font-bold text-red-600 transition hover:bg-white"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          -
                        </button>
                        <span className="min-w-10 text-center text-sm font-black">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="rounded-full px-3 py-1 text-lg font-bold text-red-600 transition hover:bg-white"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500 transition hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end sm:justify-between">
                    <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Line Total</p>
                    <p className="text-2xl font-black tracking-tight text-stone-900">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </article>
              ))}
            </section>

            <aside className="lg:sticky lg:top-24">
              <div className="rounded-[2rem] border border-stone-200 bg-[#1f1722] p-6 text-white shadow-xl shadow-stone-300/40 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">Order Snapshot</p>
                    <h2 className="mt-3 text-2xl font-black font-headline">Ready for checkout</h2>
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
                    {totalItems} items
                  </span>
                </div>

                <div className="mt-8 space-y-4 border-y border-white/10 py-6">
                  <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                  <SummaryRow label="Delivery details" value="Next page" />
                  <SummaryRow label="Home prasadam" value={containsPrasadam ? "Included in cart" : "Not selected"} />
                </div>

                <div className="mt-6 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/55">Estimated total</p>
                    <p className="mt-2 text-4xl font-black tracking-tight font-headline">{formatCurrency(subtotal)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/cart/checkout")}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#f45d48] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:brightness-110"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>

                <Link
                  href="/prasadam"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10"
                >
                  <ChevronLeft size={16} /> Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-4 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
        {icon}
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm font-bold text-stone-900">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-white/65">{label}</span>
      <span className="font-bold text-right">{value}</span>
    </div>
  );
}
