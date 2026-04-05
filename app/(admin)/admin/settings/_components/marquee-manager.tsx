"use client";

import { useEffect, useState } from "react";

interface MarqueeItem {
  id: string;
  text: string;
  link: string;
  sortOrder: number;
  active: boolean;
}

export function MarqueeManager() {
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/marquee");
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function addItem() {
    const newItem = {
      text: "New Announcement",
      link: "/poojas",
      sortOrder: items.length,
    };

    const res = await fetch("/api/admin/marquee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (res.ok) fetchItems();
  }

  async function updateItem(item: MarqueeItem) {
    setSaving(true);
    try {
      await fetch("/api/admin/marquee", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this marquee item?")) return;
    const res = await fetch(`/api/admin/marquee?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) fetchItems();
  }

  const handleChange = (id: string, field: keyof MarqueeItem, value: string | boolean) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  if (loading) return (
    <div className="p-12 text-center text-on-surface-variant">
      <p className="animate-pulse">Loading marquee ribbon items...</p>
    </div>
  );

  return (
    <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
        <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">view_carousel</span>
          Marquee Ribbon
        </h3>
        <button
          onClick={addItem}
          className="text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Item
        </button>
      </div>

      <div className="p-8 space-y-6">
        {items.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant border-2 border-dashed border-outline-variant rounded-xl">
            <p>No marquee items configured. Add one to show on homepage.</p>
          </div>
        ) : null}
        
        {items.map((item) => (
          <div key={item.id} className="p-6 bg-surface-container-low/50 rounded-xl border border-outline-variant group transition-all hover:border-primary/20">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Display Text</label>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleChange(item.id, "text", e.target.value)}
                  onBlur={() => updateItem(item)}
                  className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface outline-none"
                  placeholder="e.g. Special Deeparadhana this Friday"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Target Link</label>
                <input
                  type="text"
                  value={item.link}
                  onChange={(e) => handleChange(item.id, "link", e.target.value)}
                  onBlur={() => updateItem(item)}
                  className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface outline-none"
                  placeholder="e.g. /poojas/ganapathi-homam"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-outline-variant pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextActive = !item.active;
                    handleChange(item.id, "active", nextActive);
                    updateItem({ ...item, active: nextActive });
                  }}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                    item.active 
                      ? "bg-success/10 text-success border border-success/20" 
                      : "bg-outline-variant/10 text-on-surface-variant border border-outline-variant/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">
                    {item.active ? "check_circle" : "cancel"}
                  </span>
                  {item.active ? "Active" : "Inactive"}
                </button>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 group/del"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
                <span className="text-[10px] font-bold uppercase tracking-widest hidden group-hover/del:inline">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {saving ? (
        <div className="px-8 pb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            Syncing changes...
          </p>
        </div>
      ) : null}
    </div>
  );
}
