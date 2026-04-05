"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PackageCheck, Truck } from "lucide-react";
import { nakshatras } from "@/lib/constants";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

const bookingSchema = z.object({
  devoteeName: z.string().min(2, "Please enter the devotee name."),
  nakshatra: z.enum(nakshatras),
  gotra: z.string().optional(),
  scheduledDate: z.string().min(1, "Please select a date."),
  prasadamDelivery: z.enum(["deliver", "skip"]),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

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

export function BookingForm({ pooja }: { pooja: { id: string; name: string; price: number } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }, []);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      devoteeName: "",
      nakshatra: "Ashwini",
      gotra: "",
      scheduledDate: tomorrow,
      prasadamDelivery: "skip",
    },
  });

  const prasadamDelivery = form.watch("prasadamDelivery");

  const onSubmit = async (values: BookingFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay checkout could not be loaded.");
      }

      const paymentResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poojaId: pooja.id }),
      });

      if (!paymentResponse.ok) {
        const message = await paymentResponse.text();
        throw new Error(message || "Unable to initiate payment.");
      }

      const paymentOrder = (await paymentResponse.json()) as PaymentCreateResponse;

      const checkout = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: paymentOrder.name,
        description: paymentOrder.description,
        order_id: paymentOrder.orderId,
        prefill: {
          name: session?.user?.name || values.devoteeName,
          email: session?.user?.email || "",
        },
        notes: {
          poojaId: pooja.id,
          devoteeName: values.devoteeName,
        },
        theme: {
          color: "#171717",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
        handler: async (paymentResult: RazorpaySuccessPayload) => {
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                poojaId: pooja.id,
                devoteeName: values.devoteeName,
                nakshatra: values.nakshatra,
                gotra: values.gotra,
                scheduledDate: values.scheduledDate,
                prasadRequested: values.prasadamDelivery === "deliver",
                ...paymentResult,
              }),
            });

            if (!verifyResponse.ok) {
              const message = await verifyResponse.text();
              throw new Error(message || "Payment verification failed.");
            }

            const verificationPayload = (await verifyResponse.json()) as {
              booking?: { id: string };
            };

            const bookingId = verificationPayload.booking?.id;
            router.push(bookingId ? `/booking/confirm?bookingId=${encodeURIComponent(bookingId)}` : "/my-bookings");
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Payment verification failed.");
            setIsSubmitting(false);
          }
        },
      });

      checkout.open();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to complete booking.");
      setIsSubmitting(false);
    }
  };

  if (session == null) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-black/15 bg-stone-50 p-5 text-center">
        <p className="text-sm text-black/70">Please login to continue booking this pooja.</p>
        <Link
          href="/login"
          className="mt-4 inline-flex rounded-full bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      {errorMessage ? <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-black/55">Devotee Name</span>
          <input
            {...form.register("devoteeName")}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
            placeholder="Full name"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-black/55">Nakshatra</span>
          <select
            {...form.register("nakshatra")}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
          >
            {nakshatras.map((nakshatra) => (
              <option key={nakshatra} value={nakshatra}>
                {nakshatra}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-black/55">Gotra</span>
          <input
            {...form.register("gotra")}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
            placeholder="Optional"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-black/55">Pooja Date</span>
        <input
          type="date"
          min={tomorrow}
          {...form.register("scheduledDate")}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
        />
      </label>

      <div className="rounded-[1.75rem] border border-black/10 bg-stone-50 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
            <Truck size={18} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/55">Prasadam Delivery</p>
            <h3 className="mt-2 text-lg font-black font-headline">Should prasadam be delivered to the devotee&apos;s home?</h3>
            <p className="mt-2 text-sm leading-6 text-black/70">
              Confirm this explicitly so the booking team can handle home-delivery follow-up correctly.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => form.setValue("prasadamDelivery", "deliver", { shouldValidate: true })}
            className={`rounded-[1.5rem] border p-4 text-left transition ${
              prasadamDelivery === "deliver"
                ? "border-red-500 bg-white shadow-sm"
                : "border-black/10 bg-white/60 hover:border-black/20"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-black">Yes, arrange delivery</p>
                <p className="mt-2 text-sm leading-6 text-black/65">
                  Mark this booking for home prasadam delivery after the pooja is confirmed.
                </p>
              </div>
              <PackageCheck size={18} className={prasadamDelivery === "deliver" ? "text-red-600" : "text-black/35"} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => form.setValue("prasadamDelivery", "skip", { shouldValidate: true })}
            className={`rounded-[1.5rem] border p-4 text-left transition ${
              prasadamDelivery === "skip"
                ? "border-red-500 bg-white shadow-sm"
                : "border-black/10 bg-white/60 hover:border-black/20"
            }`}
          >
            <div>
              <p className="text-sm font-black text-black">No, temple collection only</p>
              <p className="mt-2 text-sm leading-6 text-black/65">
                Keep the booking limited to the pooja seva without home prasadam delivery.
              </p>
            </div>
          </button>
        </div>

        {prasadamDelivery === "deliver" ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Home prasadam delivery has been added to this booking request.
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Processing Payment
          </>
        ) : (
          `Pay & Confirm Booking - INR ${pooja.price}`
        )}
      </button>
    </form>
  );
}
