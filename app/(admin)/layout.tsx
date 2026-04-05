import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const nav = [
  { label: "Overview", href: "/admin", icon: "dashboard" },
  { label: "Poojas", href: "/admin/pooja-management", icon: "menu_book" },
  { label: "Prasadam", href: "/admin/prasadam-management", icon: "restaurant" },
  { label: "Goodies", href: "/admin/goodies-management", icon: "card_giftcard" },
  { label: "Offerings", href: "/admin/offerings-management", icon: "volunteer_activism" },
  { label: "Bookings", href: "/admin/bookings", icon: "event_available" },
  { label: "Orders", href: "/admin/orders", icon: "receipt_long" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
  { label: "Certificates", href: "/admin/certificates", icon: "workspace_premium" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen selection:bg-primary selection:text-on-primary flex flex-col font-body">
      {/* SideNavBar Component */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-[#f7f7f7] flex flex-col py-6 z-50">
        <div className="px-6 mb-10">
          <div className="text-2xl font-bold tracking-tighter text-primary">
            <Link className="flex items-center gap-3 md:gap-6 shrink-0" href="/">
              <span className="text-xl md:text-2xl font-black text-on-surface tracking-tighter font-headline">
                ശ്രീ muthappa madapura
              </span>
            </Link>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface transition-all duration-200 mx-2 my-1 hover:bg-surface-variant rounded-lg"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-4">
          <div className="p-4 bg-surface-variant rounded-xl mb-6 flex items-center gap-3">
            <img
              alt="Temple Administrator Avatar"
              className="w-10 h-10 rounded-full object-cover grayscale"
              src={session.user?.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-on-surface truncate">
                {session.user?.name || "Temple Admin"}
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                Sri Muthappan Madapura Indiranagar Admin
              </p>
            </div>
          </div>
          <Link
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface transition-colors"
            href="/api/auth/signout"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-label">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen flex flex-col bg-surface">
        {/* TopAppBar Component */}
        <header className="flex justify-between items-center px-8 h-16 sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-primary uppercase tracking-widest">Admin</h2>
          </div>
          <div />
        </header>

        <div className="p-10 max-w-6xl w-full mx-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-[#181212] flex flex-col md:flex-row justify-between items-center px-12 py-10 w-full relative z-50">
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
            <div className="text-lg font-bold text-[#ff8e84] font-headline mb-2">
              Sri Muthappan Madappura
            </div>
            <p className="text-[#b4a8a8] font-body text-sm tracking-wide">
              © 2024 Sri Muthappan Madappura Indiranagar. All Rights Reserved.
            </p>
          </div>
          <div className="flex space-x-8 font-body text-sm tracking-wide">
            <Link className="text-[#b4a8a8] hover:text-[#fef1f0] transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-[#b4a8a8] hover:text-[#fef1f0] transition-colors" href="#">
              Terms
            </Link>
            <Link className="text-[#b4a8a8] hover:text-[#fef1f0] transition-colors" href="#">
              Temple Map
            </Link>
            <Link className="text-[#b4a8a8] hover:text-[#fef1f0] transition-colors" href="#">
              Contact
            </Link>
          </div>
          <div className="mt-8 md:mt-0 flex gap-4">
            <a
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-[#b4a8a8] hover:border-primary hover:text-primary transition-all"
              href="#"
            >
              <span className="material-symbols-outlined text-xl">public</span>
            </a>
            <a
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-[#b4a8a8] hover:border-primary hover:text-primary transition-all"
              href="#"
            >
              <span className="material-symbols-outlined text-xl">mail</span>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
