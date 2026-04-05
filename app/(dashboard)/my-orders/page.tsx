import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Calendar, MapPin, Package } from "lucide-react";

export default async function MyOrdersPage() {
  const session = await auth();

  const [prasadOrders, goodieOrders] = await Promise.all([
    db.prasadOrder.findMany({
      where: { userId: session?.user?.id },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { item: true } } },
    }),
    db.goodieOrder.findMany({
      where: { userId: session?.user?.id },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { item: true } } },
    }),
  ]);

  return (
    <div className="flex flex-col gap-12 text-on-surface">
      <header>
        <h1 className="text-5xl font-extrabold tracking-tight font-headline">Order History</h1>
        <p className="text-on-surface-variant mt-2 text-lg">Track your sacred offerings and devotional collection.</p>
      </header>

      <div className="space-y-16">
        <OrderSection title="Prasadam Orders" orders={prasadOrders} icon="restaurant" />
        <OrderSection title="Goodie Orders" orders={goodieOrders} icon="card_giftcard" />
      </div>
    </div>
  );
}

function OrderSection({
  title,
  orders,
  icon
}: {
  title: string;
  icon: string;
  orders: any[];
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
        <h2 className="text-3xl font-bold font-headline">{title}</h2>
        <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant">
          {orders.length} Records
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-surface rounded-3xl border border-outline-variant p-6 md:p-8 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">Order Identifier</p>
                <p className="font-mono text-xs font-bold">{order.id.slice(-12).toUpperCase()}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                order.status === "PAID" || order.status === "DELIVERED" 
                  ? "bg-success/10 text-success border-success/20" 
                  : "bg-warning/10 text-on-tertiary border-warning/20"
              }`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-surface-container-low border border-outline-variant overflow-hidden">
                    <img src={item.item.image} alt={item.item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm leading-tight">{item.item.name}</p>
                    <p className="text-xs text-on-surface-variant font-medium">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-outline-variant space-y-3">
              <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                <Calendar size={14} />
                <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                <MapPin size={14} />
                <span className="truncate">{order.address}, {order.pincode}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Contribution</span>
                <span className="text-2xl font-black text-primary font-headline">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="py-20 text-center bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant">
          <Package className="mx-auto h-12 w-12 text-on-surface-variant opacity-20 mb-4" />
          <p className="text-on-surface-variant font-medium">No order history found in this category.</p>
        </div>
      )}
    </section>
  );
}
