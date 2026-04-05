import { db } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [poojaCount, prasadCount, goodiesCount, bookingCount, prasadOrders, goodieOrders] = await Promise.all([
    db.pooja.count(),
    db.prasadItem.count(),
    db.goodieItem.count(),
    db.booking.count(),
    db.prasadOrder.count(),
    db.goodieOrder.count(),
  ]);

  const stats = [
    { label: "Poojas", value: poojaCount, desc: "Live rituals available", icon: "menu_book", featured: true },
    { label: "Prasadam", value: prasadCount, desc: "Items in catalog", icon: "restaurant" },
    { label: "Goodies", value: goodiesCount, desc: "Store items", icon: "card_giftcard" },
    { label: "Bookings", value: bookingCount, desc: "Total ritual commitments", icon: "event_available" },
    { label: "Prasadam Orders", value: prasadOrders, desc: "Incoming queue", icon: "receipt_long" },
    { label: "Goodie Orders", value: goodieOrders, desc: "Incoming queue", icon: "shopping_bag" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Title Section */}
      <section className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-2">
          Temple Operations Dashboard
        </h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-3xl">
          Central command for content, catalogs, orders, and devotee workflows. 
          Use this panel to keep the public website synchronized with real temple operations.
        </p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`stat-card p-8 rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md ${
              stat.featured 
                ? "bg-primary-container border-primary/20" 
                : "bg-surface border-outline-variant hover:border-primary/30"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                stat.featured ? "text-primary" : "text-on-surface-variant"
              }`}>
                <span className="material-symbols-outlined text-lg">{stat.icon}</span>
                {stat.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight text-on-surface">
                {stat.value}
              </span>
            </div>
            <p className={`mt-4 text-sm font-medium ${
              stat.featured ? "text-primary/80" : "text-on-surface-variant"
            }`}>
              {stat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions or Recent Activity could go here */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">bolt</span>
          Quick Navigation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Manage Poojas", href: "/admin/pooja-management", icon: "edit_calendar" },
            { label: "View Bookings", href: "/admin/bookings", icon: "list_alt" },
            { label: "Orders Queue", href: "/admin/orders", icon: "orders" },
            { label: "Site Settings", href: "/admin/settings", icon: "settings_applications" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="p-4 bg-surface-container-low border border-outline-variant rounded-xl flex items-center gap-3 hover:bg-primary-container hover:border-primary/20 transition-all group"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                {action.icon}
              </span>
              <span className="text-sm font-bold text-on-surface">{action.label}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
