import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Calendar, Package, ArrowRight, Heart, Star, Clock } from "lucide-react";

export default async function DashboardOverviewPage() {
  const session = await auth();
  
  const [bookingCount, prasadCount, goodieCount] = await Promise.all([
    db.booking.count({ where: { userId: session?.user?.id } }),
    db.prasadOrder.count({ where: { userId: session?.user?.id } }),
    db.goodieOrder.count({ where: { userId: session?.user?.id } })
  ]);

  const orderCount = prasadCount + goodieCount;

  const recentBookings = await db.booking.findMany({
    where: { userId: session?.user?.id },
    include: { pooja: true },
    orderBy: { createdAt: "desc" },
    take: 2
  });

  return (
    <div className="flex flex-col gap-12 text-on-surface">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">Devotee Journey</p>
        <h1 className="text-5xl font-extrabold tracking-tight font-headline">Welcome, {session?.user?.name?.split(' ')[0]}</h1>
        <p className="text-on-surface-variant mt-2 text-lg">.</p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/my-bookings" className="group bg-surface rounded-3xl border border-outline-variant p-8 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all flex flex-col justify-between min-h-[240px]">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <span className="text-4xl font-black font-headline text-on-surface/10 group-hover:text-primary/20 transition-colors">{bookingCount}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-headline mb-1">Pooja Bookings</h2>
            <p className="text-sm text-on-surface-variant mb-6">Manage your scheduled poojas.</p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
              View All Bookings <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/my-orders" className="group bg-surface rounded-3xl border border-outline-variant p-8 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all flex flex-col justify-between min-h-[240px]">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-2xl bg-[#ffd709]/10 text-[#857300] flex items-center justify-center">
              <Package size={24} />
            </div>
            <span className="text-4xl font-black font-headline text-on-surface/10 group-hover:text-[#ffd709]/40 transition-colors">{orderCount}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-headline mb-1">Orders</h2>
            <p className="text-sm text-on-surface-variant mb-6">Track delivery status of your prasadam.</p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
              Track History <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity Mini-Section */}
      {recentBookings.length > 0 && (
        <section className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant">
          <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
            <Clock size={14} />
            Next in your path
          </h3>
          <div className="space-y-4">
            {recentBookings.map((b) => (
              <div key={b.id} className="bg-surface p-5 rounded-2xl border border-outline-variant flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none mb-1">{b.pooja.name}</p>
                    <p className="text-xs text-on-surface-variant font-medium">Scheduled for {new Date(b.scheduledDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-success/10 text-success border border-success/20">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
