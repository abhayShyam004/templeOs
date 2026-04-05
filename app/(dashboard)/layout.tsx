"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PublicFooter } from "@/components/temple/public-footer";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Package, 
  Home, 
  LogOut,
  User as UserIcon
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarDays },
  { label: "My Orders", href: "/my-orders", icon: Package },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return null;
  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body">
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 top-0 bottom-0 bg-surface border-r border-outline-variant flex flex-col z-50 hidden md:flex">
          <div className="p-8">
            <Link href="/" className="group flex flex-col">
               <span className="font-serif text-3xl leading-none text-on-surface group-hover:text-primary transition-colors">ശ്രീ</span>
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant opacity-40 mt-1">Muthappan</span>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant px-4 mb-4 opacity-60">
              Devotee Portal
            </div>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group ${
                    active 
                      ? "text-primary bg-primary/5 shadow-sm" 
                      : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <item.icon size={18} className={active ? "scale-110" : "group-hover:scale-110 transition-transform"} />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="pt-8">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant px-4 mb-4 opacity-60">
                Quick Links
              </div>
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Home size={18} />
                Temple Home
              </Link>
            </div>
          </nav>

          <div className="p-4 mt-auto">
            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {session.user?.name?.[0] || <UserIcon size={20} />}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{session.user?.name}</p>
                <p className="text-[10px] text-on-surface-variant truncate">{session.user?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-error hover:bg-error/5 transition-all w-full text-left"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
          {/* Mobile Header */}
          <header className="md:hidden border-b border-outline-variant bg-surface px-4 py-4 flex items-center justify-between sticky top-0 z-40">
            <Link href="/" className="font-serif text-2xl text-primary">ശ്രീ</Link>
            <div className="flex gap-4">
              <Link href="/dashboard" className={`p-2 ${pathname === '/dashboard' ? 'text-primary' : 'text-on-surface-variant'}`}><LayoutDashboard size={20} /></Link>
              <Link href="/my-bookings" className={`p-2 ${pathname === '/my-bookings' ? 'text-primary' : 'text-on-surface-variant'}`}><CalendarDays size={20} /></Link>
              <Link href="/my-orders" className={`p-2 ${pathname === '/my-orders' ? 'text-primary' : 'text-on-surface-variant'}`}><Package size={20} /></Link>
            </div>
          </header>

          <div className="p-6 md:p-12 lg:p-16 flex-1">
            {children}
          </div>
          
          <PublicFooter />
        </main>
      </div>
    </div>
  );
}
