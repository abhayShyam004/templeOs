"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, LockKeyhole, MapPinned, Truck } from "lucide-react";
import { PublicFooter } from "@/components/temple/public-footer";
import {
  createManualDeliveryLocation,
  requestBrowserDeliveryLocation,
  useDeliveryLocation,
} from "@/lib/delivery-location";
import {
  CartItem,
  getCartStorageKey,
  readStoredCart,
  writeStoredCart,
} from "@/lib/cart-storage";
import { formatCurrency } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

type PaymentCreateResponse = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
};

type RazorpaySuccessPayload = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

async function loadRazorpayScript() {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
  );

  if (existingScript) {
    return new Promise<boolean>((resolve) => {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
    });
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const { location, saveLocation } = useDeliveryLocation();
  const sessionUserId = (session?.user as { id?: string; email?: string } | undefined)?.id ?? session?.user?.email ?? null;
  const cartStorageKey = getCartStorageKey(sessionUserId);

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated") {
      setLoading(false);
      router.replace("/login?callbackUrl=/cart/checkout");
      return;
    }

    const storedItems = readStoredCart(cartStorageKey);
    setItems(storedItems);
    setLoading(false);

    if (storedItems.length === 0) {
      router.replace("/cart");
    }
  }, [status, router, cartStorageKey]);

  useEffect(() => {
    if (location?.address && !address) {
      setAddress(location.address);
    }

    if (location?.pincode && !pincode) {
      setPincode(location.pincode);
    }
  }, [location, address, pincode]);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );
  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const persistManualLocation = () => {
    if (!address.trim()) return;

    saveLocation(
      createManualDeliveryLocation({
        label: location?.source === "manual" ? location.label : undefined,
        address,
        pincode,
      }),
    );
  };

  const handleUseCurrentLocation = async () => {
    setDetectingLocation(true);
    setLocationError("");

    try {
      const nextLocation = await requestBrowserDeliveryLocation();
      saveLocation(nextLocation);
      setAddress(nextLocation.address || "");
      setPincode(nextLocation.pincode || "");
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : "Unable to determine your current location.");
    } finally {
      setDetectingLocation(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!phone.trim() || !address.trim() || !pincode.trim()) {
      setLocationError("Phone, address, and pincode are required to complete the order.");
      return;
    }

    setCheckingOut(true);
    setLocationError("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay checkout could not be loaded.");
      }

      const response = await fetch("/api/orders/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          phone: phone.trim(),
          address: address.trim(),
          pincode: pincode.trim(),
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Checkout failed. Please try again.");
      }

      const paymentOrder = (await response.json()) as PaymentCreateResponse;

      const checkout = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: paymentOrder.name,
        description: paymentOrder.description,
        order_id: paymentOrder.orderId,
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          contact: phone.trim(),
        },
        notes: {
          checkoutType: "cart",
          itemCount: String(totalItems),
        },
        theme: {
          color: "#f45d48",
        },
        modal: {
          ondismiss: () => {
            setCheckingOut(false);
          },
        },
        handler: async (paymentResult: RazorpaySuccessPayload) => {
          try {
            const verifyResponse = await fetch("/api/orders/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items,
                phone: phone.trim(),
                address: address.trim(),
                pincode: pincode.trim(),
                ...paymentResult,
              }),
            });

            if (!verifyResponse.ok) {
              const message = await verifyResponse.text();
              throw new Error(message || "Payment verification failed.");
            }

            persistManualLocation();
            writeStoredCart(cartStorageKey, []);
            setItems([]);
            setOrderSuccess(true);
          } catch (error) {
            setLocationError(
              error instanceof Error ? error.message : "Payment verification failed. Please try again.",
            );
            setCheckingOut(false);
          }
        },
      });

      checkout.open();
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : "Checkout failed. Please try again.");
      setCheckingOut(false);
    }
  };

  if (loading || status === "loading") return null;
  if (status !== "authenticated") return null;

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#f7f1eb] text-stone-900 flex flex-col">
        <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-16 md:px-8">
          <div className="w-full rounded-[2.25rem] border border-stone-200 bg-white p-8 text-center shadow-xl shadow-stone-200/70 md:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={34} />
            </div>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-700">Payment Confirmed</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight font-headline md:text-5xl">Your order has been placed.</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600 md:text-base">
              Payment was verified successfully and your delivery details were recorded. You can track processing from your orders dashboard.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/my-orders" className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700">
                Track Orders
              </Link>
              <Link href="/" className="rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-bold text-stone-800 transition hover:bg-stone-50">
                Return Home
              </Link>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f1eb] text-stone-900 flex flex-col overflow-x-hidden">
      <nav className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f7f1eb]/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="min-w-0">
            <Link href="/" className="text-lg font-black tracking-tight text-red-600 md:text-2xl font-headline">
              ശ്രീ Muthappa Madapura
            </Link>
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-stone-500">Checkout</p>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-700 transition hover:bg-stone-50"
          >
            <ArrowLeft size={14} /> Back to Cart
          </Link>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-8 md:py-10">
        <div className="grid gap-4 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_20rem] lg:items-center md:p-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-600">Step 2 of 2</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl font-headline">Confirm delivery details and place the order.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
              This page collects address and contact details only after the cart is reviewed, which keeps the ordering flow cleaner on both desktop and mobile.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <StageTile icon={<LockKeyhole size={18} />} label="Secure step" value="Address confirmation" />
            <StageTile icon={<Truck size={18} />} label="Delivery items" value={`${totalItems} selected`} />
            <StageTile icon={<MapPinned size={18} />} label="Location" value={location?.label || "Set below"} />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_24rem] lg:items-start">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Delivery location</p>
                  <h2 className="mt-2 text-2xl font-black font-headline">Where should we send this order?</h2>
                  <p className="mt-2 text-sm text-stone-600">Use the browser location for speed or enter the complete address manually.</p>
                </div>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={detectingLocation}
                  className="rounded-full bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {detectingLocation ? "Locating..." : "Use Current Location"}
                </button>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Saved location</p>
                <p className="mt-2 text-lg font-black text-stone-900">{location?.label || "No location saved yet"}</p>
                {location?.address ? <p className="mt-2 break-words text-sm text-stone-600">{location.address}</p> : null}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">Phone number</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter active phone number"
                    className="w-full rounded-[1.25rem] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">Pincode</span>
                  <input
                    value={pincode}
                    onChange={(event) => setPincode(event.target.value)}
                    onBlur={persistManualLocation}
                    placeholder="Postal code"
                    className="w-full rounded-[1.25rem] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">Delivery address</span>
                <textarea
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  onBlur={persistManualLocation}
                  rows={5}
                  placeholder="House number, street, landmark, area, city"
                  className="w-full resize-none rounded-[1.5rem] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                />
              </label>

              {locationError ? <p className="mt-4 text-sm text-red-600">{locationError}</p> : null}
            </div>

            <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm md:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">Items being delivered</p>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-[1.25rem] border border-stone-200 bg-stone-50 p-3">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-black font-headline">{item.name}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{item.type} · Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-stone-900">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[2rem] border border-stone-200 bg-[#1f1722] p-6 text-white shadow-xl shadow-stone-300/40 md:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">Final summary</p>
              <h2 className="mt-3 text-2xl font-black font-headline">Place your order</h2>

              <div className="mt-8 space-y-4 border-y border-white/10 py-6">
                <SummaryRow label="Items" value={`${totalItems}`} />
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                <SummaryRow label="Delivery to" value={location?.label || "Manual address"} />
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.18em] text-white/55">Total contribution</p>
                <p className="mt-2 text-4xl font-black tracking-tight font-headline">{formatCurrency(subtotal)}</p>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={checkingOut}
                className="mt-8 flex w-full items-center justify-center rounded-full bg-[#f45d48] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {checkingOut ? "Opening Payment..." : "Pay & Place Order"}
              </button>

              <Link
                href="/cart"
                className="mt-3 flex w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10"
              >
                Back to Cart Review
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

function StageTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}
