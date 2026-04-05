"use client";

import { useEffect, useMemo, useState } from "react";

type FieldType = "text" | "number" | "textarea" | "checkbox";

type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
};

type CatalogManagerProps = {
  title: string;
  subtitle: string;
  endpoint: string;
  fields: FieldConfig[];
  booleanBadgeField?: string;
  booleanBadgeLabel?: [string, string];
};

export function CatalogManager({
  title,
  subtitle,
  endpoint,
  fields,
  booleanBadgeField,
  booleanBadgeLabel = ["Active", "Inactive"],
}: CatalogManagerProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const initialData = useMemo(() => {
    const values: Record<string, any> = {};
    for (const field of fields) {
      values[field.name] = field.type === "checkbox" ? true : "";
    }
    return values;
  }, [fields]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  useEffect(() => {
    if (!editingId) {
      setFormData(initialData);
    }
  }, [initialData, editingId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    for (const field of fields) {
      if (field.type === "number") payload[field.name] = Number(payload[field.name] || 0);
    }

    try {
      if (editingId) {
        await fetch(`${endpoint}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setFormData(initialData);
      setEditingId(null);
      setShowForm(false);
      await fetchItems();
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      await fetchItems();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Title Section */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-2">
            {title}
          </h1>
          <p className="text-on-surface-variant font-medium text-lg">
            {subtitle}
          </p>
        </div>
        
        {!showForm && (
          <button
            onClick={() => {
              setEditingId(null);
              setFormData(initialData);
              setShowForm(true);
            }}
            className="bg-primary text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add New Item
          </button>
        )}
      </section>

      {showForm ? (
        <div className="lg:col-span-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-surface p-8 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
                  {editingId ? "edit_square" : "add_circle"}
                </span>
                {editingId ? "Edit Item" : "Create New Item"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData(initialData);
                }}
                className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to List
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => {
                  if (field.type === "checkbox") return null;
                  return (
                    <div key={field.name} className={`space-y-2 ${field.type === "textarea" ? "md:col-span-2" : ""}`}>
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          value={formData[field.name] ?? ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface resize-none outline-none"
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                          rows={3}
                        />
                      ) : (
                        <div className="relative">
                          {field.name === "price" && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
                          )}
                          <input
                            type={field.type}
                            value={formData[field.name] ?? ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                            className={`w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface outline-none ${field.name === "price" ? "pl-8 font-mono" : ""}`}
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Checkbox fields (like Visibility) */}
              {fields.filter(f => f.type === "checkbox").map(field => (
                <div key={field.name} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">
                      {field.name === "available" || field.name === "inStock" ? "visibility" : "check_circle"}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{field.label}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                        Control public availability
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, [field.name]: !prev[field.name] }))}
                    className={`w-12 h-6 rounded-full relative flex items-center transition-colors duration-200 ${formData[field.name] ? "bg-primary justify-end" : "bg-outline-variant justify-start"} px-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </button>
                </div>
              ))}

              <div className="pt-6 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined">
                    {editingId ? "save" : "published_with_changes"}
                  </span>
                  {editingId ? "Update Item" : "Add to Catalog"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 bg-surface border border-outline-variant font-bold rounded-xl hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="lg:col-span-12 animate-in fade-in duration-500">
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">list_alt</span>
                Existing Items
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
                {items.length} Records
              </span>
            </div>
            
            <div className="divide-y divide-outline-variant">
              {loading ? (
                <div className="p-12 text-center text-on-surface-variant">
                  <p className="animate-pulse">Loading catalog...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="p-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inventory_2</span>
                  <p>No records found in this catalog.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="p-6 flex flex-wrap items-center justify-between gap-4 hover:bg-surface-container-low/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-outline-variant" />
                      )}
                      <div>
                        <h4 className="font-bold text-on-surface">{item.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          {item.price != null && (
                            <span className="text-xs font-mono text-on-surface-variant bg-surface-container rounded px-2 py-0.5 border border-outline-variant">
                              ₹{item.price}
                            </span>
                          )}
                          {booleanBadgeField && (
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item[booleanBadgeField] ? "bg-success/10 text-success border-success/20" : "bg-outline-variant/10 text-on-surface-variant border-outline-variant/20"}`}>
                              {item[booleanBadgeField] ? booleanBadgeLabel[0] : booleanBadgeLabel[1]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        title="Edit Item"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all"
                        title="Delete Item"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
