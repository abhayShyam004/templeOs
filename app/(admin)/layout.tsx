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
    <div className="bg-surface text-on-surface min-h-screen selection:bg-primary selection:text-on-primary flex flex-col font-body overflow-x-hidden">
      {/* SideNavBar Component */}
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-16 flex-col border-r border-outline-variant bg-[#f7f7f7] py-4 md:w-64 md:py-6">
        <div className="mb-6 flex justify-center px-2 md:mb-10 md:justify-start md:px-6">
          <Link className="flex shrink-0 items-center gap-3 md:gap-6" href="/" aria-label="Go to temple site">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-lg font-black text-primary md:hidden">
              ॐ
            </span>
            <span className="hidden text-xl font-black tracking-tighter text-on-surface font-headline md:inline md:text-2xl">
              ശ്രീ muthappa madapura
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar px-2 md:px-0">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className="mx-auto my-1 flex h-11 w-11 items-center justify-center rounded-xl text-on-surface-variant transition-all duration-200 hover:bg-surface-variant hover:text-on-surface md:mx-2 md:h-auto md:w-auto md:justify-start md:gap-3 md:px-4 md:py-3"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="hidden text-sm font-label md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-2 md:px-4">
          <div className="mb-4 flex items-center justify-center rounded-xl bg-surface-variant p-2 md:mb-6 md:justify-start md:gap-3 md:p-4">
            <img
              alt="Temple Administrator Avatar"
              className="h-10 w-10 rounded-full object-cover grayscale"
              src={session.user?.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
            />
            <div className="hidden overflow-hidden md:block">
              <p className="text-xs font-bold text-on-surface truncate">
                {session.user?.name || "Temple Admin"}
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                Sri Muthappan Madapura Indiranagar Admin
              </p>
            </div>
          </div>
          <Link
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface md:mx-0 md:h-auto md:w-auto md:justify-start md:gap-3 md:px-4 md:py-3"
            href="/api/auth/signout"
            title="Logout"
            aria-label="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="hidden text-sm font-label md:inline">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-16 min-h-screen flex flex-col bg-surface md:ml-64">
        {/* TopAppBar Component */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-outline-variant/30 bg-surface/80 px-4 backdrop-blur-xl md:h-16 md:px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.22em] text-primary md:text-lg md:tracking-widest">Admin</h2>
          </div>
          <div />
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 p-4 md:p-10">
          {children}
        </div>

        {/* Footer */}
        <footer className="relative z-50 flex w-full flex-col justify-between gap-6 bg-[#181212] px-4 py-6 md:flex-row md:items-center md:px-12 md:py-10">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="text-lg font-bold text-[#ff8e84] font-headline mb-2">
              Sri Muthappan Madappura
            </div>
            <p className="text-[#b4a8a8] font-body text-sm tracking-wide">
              © 2024 Sri Muthappan Madappura Indiranagar. All Rights Reserved.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-body text-xs tracking-wide md:gap-8 md:text-sm">
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
          <div className="flex gap-4">
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
