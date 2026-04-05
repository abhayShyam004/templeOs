import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Package, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

type BookingConfirmPageProps = {
  searchParams?: {
    bookingId?: string;
  };
};

export default async function BookingConfirmPage({ searchParams }: BookingConfirmPageProps) {
  const session = await auth();
  const bookingId = searchParams?.bookingId;

  const booking = bookingId && session?.user?.id
    ? await db.booking.findFirst({
        where: { id: bookingId, userId: session.user.id },
        include: { pooja: true },
      })
    : null;

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-8 md:py-16 lg:grid-cols-[minmax(0,1.1fr)_24rem] lg:items-start">
      <div className="rounded-[2.25rem] border border-black/10 bg-white p-6 shadow-xl shadow-black/5 md:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-700">Booking Confirmed</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight font-headline md:text-5xl">
          {booking ? "Your pooja booking is confirmed." : "Your seva has been received."}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-black/70 md:text-base">
          {booking
            ? "The booking has been recorded in your account. Use the summary below to verify the pooja date and the prasadam delivery decision."
            : "We could not load the booking details directly on this screen, but the booking flow is complete and your booking history has the latest record."}
        </p>

        {booking ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <DetailCard
              icon={<Sparkles size={18} />}
              label="Pooja"
              value={booking.pooja.name}
              note={`Contribution ${formatCurrency(booking.pooja.price)}`}
            />
            <DetailCard
              icon={<CalendarDays size={18} />}
              label="Scheduled Date"
              value={formatDate(booking.scheduledDate.toISOString())}
              note={`Nakshatra ${booking.nakshatra}`}
            />
            <DetailCard
              icon={<Package size={18} />}
              label="Devotee"
              value={booking.devoteeName}
              note={booking.gotra ? `Gotra ${booking.gotra}` : "Gotra not specified"}
            />
            <DetailCard
              icon={<Package size={18} />}
              label="Prasadam Delivery"
              value={booking.prasadRequested ? "Home delivery requested" : "Temple collection only"}
              note={booking.prasadRequested ? "Delivery follow-up required" : "No home delivery requested"}
            />
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/my-bookings" className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-black/90">
            View My Bookings
          </Link>
          <Link href="/poojas" className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-stone-50">
            Book Another Pooja
          </Link>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24">
        <div className="rounded-[2rem] border border-black/10 bg-[#19151f] p-6 text-white shadow-xl shadow-black/10 md:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/50">Booking Snapshot</p>
          <div className="mt-6 space-y-4">
            <SnapshotRow label="Booking ID" value={booking ? booking.id.slice(-12).toUpperCase() : "Available in My Bookings"} />
            <SnapshotRow label="Status" value={booking?.status || "Confirmed"} />
            <SnapshotRow label="Payment" value={booking?.paymentStatus || "Pending integration"} />
            <SnapshotRow label="Delivery choice" value={booking?.prasadRequested ? "Deliver home prasadam" : "No home delivery"} />
          </div>
          <p className="mt-6 text-sm leading-6 text-white/65">
            Keep this reference for follow-up. The same record is now visible in the account booking history.
          </p>
        </div>
      </aside>
    </section>
  );
}

function DetailCard({ icon, label, value, note }: { icon: ReactNode; label: string; value: string; note: string }) {
  return (
    <div className="rounded-[1.5rem] border border-black/10 bg-stone-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
        {icon}
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-black/50">{label}</p>
      <p className="mt-2 text-lg font-black leading-tight">{value}</p>
      <p className="mt-2 text-sm text-black/60">{note}</p>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-sm last:border-b-0 last:pb-0">
      <span className="text-white/55">{label}</span>
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}
