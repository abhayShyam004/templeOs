import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Star, Calendar, Info, Package } from "lucide-react";

export default async function MyBookingsPage() {
  const session = await auth();
  const bookings = await db.booking.findMany({
    where: { userId: session?.user?.id },
    include: { pooja: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-12 text-on-surface">
      <header>
        <h1 className="text-5xl font-extrabold tracking-tight font-headline">Ritual Registry</h1>
        <p className="text-on-surface-variant mt-2 text-lg">A chronological ledger of your scheduled poojas and divine commitments.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-surface rounded-3xl border border-outline-variant p-6 md:p-8 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Booking Token</p>
                <p className="font-mono text-xs font-bold">{booking.id.toUpperCase()}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                booking.paymentStatus === "PAID" 
                  ? "bg-success/10 text-success border-success/20" 
                  : "bg-warning/10 text-on-tertiary border-warning/20"
              }`}>
                {booking.paymentStatus}
              </span>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Star size={16} fill="currentColor" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Confirmed Ritual</span>
              </div>
              <h3 className="text-3xl font-bold font-headline leading-tight text-on-surface">
                {booking.pooja.name}
              </h3>
            </div>

            <div className="mt-auto pt-6 border-t border-outline-variant space-y-4">
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <Calendar size={16} className="text-primary" />
                <span className="font-medium">Scheduled for {new Date(booking.scheduledDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <Info size={16} className="text-primary" />
                <span className="font-medium">Status: {booking.status}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <Package size={16} className="text-primary" />
                <span className="font-medium">
                  {booking.prasadRequested ? "Prasadam home delivery requested" : "Prasadam home delivery not requested"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="py-24 text-center bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant">
          <Calendar className="mx-auto h-12 w-12 text-on-surface-variant opacity-20 mb-4" />
          <p className="text-on-surface-variant font-medium mb-8">Your ritual registry is currently empty.</p>
          <Link href="/poojas" className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
            Book your first Pooja
          </Link>
        </div>
      )}
    </div>
  );
}
