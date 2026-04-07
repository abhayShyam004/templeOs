"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { PublicFooter } from "./public-footer";
import { DeliveryLocationControl } from "./delivery-location-control";
import { getCartStorageKey, getCartUpdatedEventName, readStoredCart, writeStoredCart } from "@/lib/cart-storage";

export type MarketplaceItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  duration?: string;
  category?: string;
  grams?: number;
  averageRating?: number | null;
  reviewCount?: number;
};

type Props = {
  items: MarketplaceItem[];
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
  activeCategory?: string;
  filterTitle?: string;
  categories?: string[];
  itemActionLabel?: string;
  detailHrefPrefix: string;
  itemActionMode?: "detail" | "add-to-cart";
  allowCart?: boolean;
  showItemAction?: boolean;
};

export default function PublicMarketplace({
  items,
  title,
  subtitle,
  searchPlaceholder = "Search...",
  activeCategory,
  filterTitle = "Filters",
  categories = [],
  itemActionLabel = "View Details",
  detailHrefPrefix,
  itemActionMode = "detail",
  allowCart = true,
  showItemAction = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const sessionUserId = (session?.user as { id?: string; email?: string } | undefined)?.id ?? session?.user?.email ?? null;
  const cartStorageKey = getCartStorageKey(sessionUserId);
  const cartUpdatedEvent = getCartUpdatedEventName();

  useEffect(() => {
    const updateCount = () => {
      if (!session) {
        setCartCount(0);
        return;
      }

      const cart = readStoredCart(cartStorageKey);
      setCartCount(cart.reduce((acc: number, item: any) => acc + item.quantity, 0));
    };
    updateCount();
    window.addEventListener(cartUpdatedEvent, updateCount);
    return () => window.removeEventListener(cartUpdatedEvent, updateCount);
  }, [session, cartStorageKey, cartUpdatedEvent]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      
      const matchesCategory = 
        selectedCategories.length === 0 || 
        (item.category && selectedCategories.includes(item.category));

      const matchesPrice = !priceRange || (
        priceRange === "Under ₹1,000" ? item.price < 1000 :
        priceRange === "₹1,000 - ₹5,000" ? (item.price >= 1000 && item.price <= 5000) :
        priceRange === "₹5,000 - ₹10,000" ? (item.price >= 5000 && item.price <= 10000) :
        priceRange === "Above ₹10,000" ? item.price > 10000 : true
      );

      const matchesRating =
        minRating == null ||
        (typeof item.averageRating === "number" &&
          Number.isFinite(item.averageRating) &&
          item.averageRating >= minRating);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [items, minRating, priceRange, query, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const navLinks = [
    { label: "Pooja", href: "/poojas", active: activeCategory === "poojas" },
    { label: "Prasadam", href: "/prasadam", active: activeCategory === "prasadam" },
    { label: "Goodies", href: "/goodies", active: activeCategory === "goodies" },
    { label: "Offerings", href: "/offerings", active: activeCategory === "offerings" },
  ];

  const addItemToCart = (item: MarketplaceItem) => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    const cart = readStoredCart(cartStorageKey);
    const existing = cart.find((i: any) => i.id === item.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        type: activeCategory === "prasadam" ? "prasadam" : "goodie",
        grams: item.grams,
      });
    }

    writeStoredCart(cartStorageKey, cart);
  };

  return (
    <div className="bg-background text-on-surface selection:bg-primary/20 selection:text-primary font-body min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 z-50 w-full px-4 md:px-6 py-2 bg-surface/95 backdrop-blur-md flex flex-col border-b border-outline-variant transition-all duration-300">
        <div className="flex min-w-0 items-center justify-between gap-4 md:gap-8 py-2">
          {/* Brand */}
          <div className="flex min-w-0 items-center gap-4 md:gap-6">
            <Link href="/" className="shrink-0">
              <span className="text-xl md:text-2xl font-black text-on-surface tracking-tighter font-headline">ശ്രീ muthappa madapura&nbsp;</span>
            </Link>
            {session && <DeliveryLocationControl />}
          </div>
          
          {/* Search Bar */}
          <div className="hidden min-w-0 sm:flex flex-1 max-w-2xl relative">
            <div className="group relative flex items-center w-full">
              <input 
                className="w-full bg-surface-container-high border border-outline-variant rounded-xl py-2 md:py-2.5 pl-10 md:pl-12 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-on-surface-variant/50 transition-all outline-none" 
                placeholder={searchPlaceholder} 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-3 md:left-4 text-on-surface-variant text-xl">search</span>
            </div>
          </div>
          
          {/* Trailing Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link href={session ? "/dashboard" : "/login"} className="hidden md:flex flex-col items-start cursor-pointer hover:bg-surface-container-high px-3 py-1 rounded-lg transition-colors">
              <span className="text-[10px] text-on-surface-variant leading-none">Hello, {session?.user?.name || "Sign in"}</span>
              <span className="text-xs font-bold text-on-surface">Account</span>
            </Link>
            {session && (
              <Link href="/my-orders" className="hidden md:flex flex-col items-start cursor-pointer hover:bg-surface-container-high px-3 py-1 rounded-lg transition-colors">
                <span className="text-[10px] text-on-surface-variant leading-none">Returns</span>
                <span className="text-xs font-bold text-on-surface">Orders</span>
              </Link>
            )}
            <button className="sm:hidden p-2 hover:bg-surface-container-high rounded-full transition-all">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
            </button>
            {session && (
              <Link href="/cart" className="relative p-2 hover:bg-surface-container-high rounded-full transition-all">
                <span className="material-symbols-outlined text-primary">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
        
        {/* Secondary Nav Links */}
        <div className="flex items-center gap-6 md:gap-8 py-2 overflow-x-auto no-scrollbar scroll-smooth">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              className={`${link.active ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface transition-colors'} text-[10px] md:text-xs font-semibold tracking-tight uppercase whitespace-nowrap`} 
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="pt-40 pb-20 flex-1">
        {/* Product Grid & Sidebar */}
        <div className="px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant rounded-xl font-bold text-sm"
            >
              <span className="material-symbols-outlined text-xl">filter_list</span>
              Filters
            </button>
            <div className="text-xs text-on-surface-variant font-medium">
              {filtered.length} Items available
            </div>
          </div>

          {/* Left Column: Filters */}
          <aside className={`col-span-1 lg:col-span-3 space-y-8 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm lg:sticky lg:top-32">
              <div className="flex items-center justify-between lg:block mb-6">
                <h3 className="text-lg font-bold text-on-surface font-headline">{filterTitle}</h3>
                <button onClick={() => setIsFilterOpen(false)} className="lg:hidden">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="space-y-6">
                {/* Category Type */}
                {categories.length > 0 && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Categories</span>
                    <div className="space-y-3">
                      {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="rounded border-outline-variant bg-transparent text-primary focus:ring-primary w-5 h-5" 
                            type="checkbox" 
                          />
                          <span className="text-sm text-on-surface group-hover:text-primary transition-colors">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Price Range */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Price Range</span>
                  <div className="space-y-2">
                    {["Under ₹1,000", "₹1,000 - ₹5,000", "₹5,000 - ₹10,000", "Above ₹10,000"].map((band) => (
                      <button 
                        key={band}
                        onClick={() => setPriceRange(priceRange === band ? null : band)}
                        className={`block text-sm transition-colors text-left w-full ${priceRange === band ? 'text-primary font-bold' : 'text-on-surface hover:text-primary'}`}
                      >
                        {band}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Ratings */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Ratings</span>
                  <div className="space-y-2">
                    {[4, 3].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setMinRating((current) => (current === rating ? null : rating))}
                        className={`flex items-center gap-1 transition ${minRating === rating ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}
                      >
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: `'FILL' ${i < rating ? 1 : 0}` }}>star</span>
                          ))}
                        </div>
                        <span className="text-xs">& Up</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Product Grid */}
          <section className="col-span-1 lg:col-span-9">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight font-headline">{title}</h2>
              <p className="text-on-surface-variant mt-2">{subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((item) => {
                const detailHref = `${detailHrefPrefix}/${item.id}`;
                const hasRatings = typeof item.averageRating === "number" && (item.reviewCount ?? 0) > 0;
                return (
                  <div key={item.id} className="relative bg-surface rounded-xl md:rounded-2xl overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 border border-outline-variant shadow-sm group flex flex-col h-full">
                    <Link href={detailHref} aria-label={`View details for ${item.name}`} className="absolute inset-0 z-10" />
                    <div className="h-40 md:h-48 relative overflow-hidden shrink-0">
                      <img 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        src={item.image}
                      />
                      {hasRatings && (item.averageRating ?? 0) >= 4.7 && (
                        <span className="absolute top-3 right-3 bg-secondary text-on-secondary px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter">Bestseller</span>
                      )}
                    </div>
                    <div className="relative z-20 p-4 md:p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-base md:text-lg mb-1 font-headline truncate">{item.name}</h3>
                      {hasRatings ? (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="material-symbols-outlined text-[10px] md:text-xs" style={{ fontVariationSettings: `'FILL' ${i < Math.round(item.averageRating || 0) ? 1 : 0}` }}>star</span>
                            ))}
                          </div>
                          <span className="text-[10px] text-on-surface-variant">
                            {(item.averageRating || 0).toFixed(1)} · {item.reviewCount} ratings
                          </span>
                        </div>
                      ) : (
                        <div className="mb-3 text-[10px] uppercase tracking-widest text-on-surface-variant">
                          No ratings yet
                        </div>
                      )}
                      
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 flex-1">{item.description}</p>
                      {typeof item.grams === "number" ? (
                        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                          {item.grams}g
                        </p>
                      ) : null}

                      <div className="flex items-end justify-between">
                        <div className="text-xl md:text-2xl font-black text-on-surface leading-none font-headline">₹{item.price}</div>
                        {allowCart && (
                          <button 
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              addItemToCart(item);
                            }}
                            className="bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all border border-outline-variant"
                          >
                            <span className="material-symbols-outlined text-xl md:text-2xl">add_shopping_cart</span>
                          </button>
                        )}
                      </div>
                      {showItemAction && (
                        itemActionMode === "add-to-cart" ? (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              addItemToCart(item);
                              router.push("/cart");
                            }}
                            className="block w-full mt-4 py-2.5 md:py-3 bg-primary/5 border border-primary/20 text-primary text-center font-bold rounded-lg md:rounded-xl hover:bg-primary hover:text-on-primary transition-all text-sm md:text-base"
                          >
                            {itemActionLabel}
                          </button>
                        ) : (
                          <Link href={detailHref} className="block w-full mt-4 py-2.5 md:py-3 bg-primary/5 border border-primary/20 text-primary text-center font-bold rounded-lg md:rounded-xl hover:bg-primary hover:text-on-primary transition-all text-sm md:text-base">
                            {itemActionLabel}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="mt-8 md:mt-12 text-center py-12 md:py-20 bg-surface rounded-2xl md:rounded-3xl border border-dashed border-outline-variant px-6">
                <span className="material-symbols-outlined text-5xl md:text-6xl text-on-surface-variant opacity-20 mb-4">search_off</span>
                <h3 className="text-lg md:text-xl font-bold text-on-surface mb-2">No Items Found</h3>
                <p className="text-sm md:text-base text-on-surface-variant">Try adjusting your filters or search query.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
