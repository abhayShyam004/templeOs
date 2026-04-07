import { db } from "@/lib/db";

export default async function AdminOrdersPage() {
  const [prasadOrders, goodieOrders] = await Promise.all([
    db.prasadOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
      take: 30,
    }),
    db.goodieOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
      take: 30,
    }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Title Section */}
      <section>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
          Order Processing
        </h1>
        <p className="max-w-2xl text-base font-medium text-on-surface-variant md:text-lg">
          Track and fulfill prasadam and devotee goodies orders. 
          Real-time fulfillment queue from the public store.
        </p>
      </section>

      <div className="space-y-16">
        <OrderTable title="Prasadam Orders" rows={prasadOrders} icon="restaurant" />
        <OrderTable title="Goodie Orders" rows={goodieOrders} icon="card_giftcard" />
      </div>
    </div>
  );
}

function statusClass(status: string) {
  const value = status.toUpperCase();
  if (value === "PAID" || value === "COMPLETED") return "bg-success/10 text-success border-success/20";
  if (value === "PENDING") return "bg-warning/10 text-on-tertiary border-warning/20";
  return "bg-outline-variant/10 text-on-surface-variant border-outline-variant/20";
}

function OrderTable({
  title,
  rows,
  icon
}: {
  title: string;
  icon: string;
  rows: Array<{
    id: string;
    status: string;
    totalAmount: number;
    createdAt: Date;
    user: { name: string | null; email: string };
  }>;
}) {
  return (
    <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
      <div className="flex flex-col gap-3 border-b border-outline-variant bg-surface-container-low p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">{icon}</span>
          {title}
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
          {rows.length} Recent
        </span>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">ID</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Devotee</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Amount</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-surface-container-low/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                  {row.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-on-surface">{row.user.name || "Devotee"}</p>
                  <p className="text-xs text-on-surface-variant font-mono">{row.user.email}</p>
                </td>
                <td className="px-6 py-4 font-mono text-on-surface font-bold">
                  ₹{row.totalAmount}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${statusClass(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-on-surface-variant">
                  {new Date(row.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-20">shopping_cart_off</span>
            <p>No orders found in this category.</p>
          </div>
        )}
      </div>

      <div className="divide-y divide-outline-variant md:hidden">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-20">shopping_cart_off</span>
            <p>No orders found in this category.</p>
          </div>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    {row.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="mt-2 truncate text-base font-bold text-on-surface">{row.user.name || "Devotee"}</p>
                  <p className="mt-1 break-all text-xs font-mono text-on-surface-variant">{row.user.email}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass(row.status)}`}>
                  {row.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-outline-variant bg-surface-container-low p-3">
                <MobileInfo label="Amount" value={`₹${row.totalAmount}`} />
                <MobileInfo
                  label="Date"
                  value={new Date(row.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                />
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function MobileInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">{label}</p>
      <p className="mt-1 text-sm font-bold text-on-surface">{value}</p>
    </div>
  );
}
