"use client";

import { useEffect, useState } from "react";
import { SITE_SETTING_DEFAULTS } from "@/lib/site-settings-defaults";
import { MarqueeManager } from "./_components/marquee-manager";

type Setting = {
  key: string;
  value: string;
  type?: string;
  description?: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const run = async () => {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      const map = new Map((Array.isArray(data) ? data : []).map((item: Setting) => [item.key, item]));

      const merged = Object.entries(SITE_SETTING_DEFAULTS).map(([key, value]) => {
        const existing = map.get(key);
        if (existing) return existing;
        return {
          key,
          value,
          type: "text",
          description: "Temple site content",
        } as Setting;
      });

      setSettings(merged);
    };

    run();
  }, []);

  const onChange = (key: string, value: string) => {
    setSettings((prev) => prev.map((item) => (item.key === key ? { ...item, value } : item)));
  };

  const saveAll = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Title Section */}
      <section>
        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-2">
          Site Configuration
        </h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-3xl">

        </p>Update homepage text, contact details
      </section>

      {/* Content Registry */}
      <div className="bg-surface p-8 rounded-xl border border-outline-variant shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
              app_registration
            </span>
            Content Registry
          </h3>
        </div>

        <div className="space-y-8">
          {settings.map((setting) => (
            <div key={setting.key} className="space-y-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">
                {setting.key.replace(/_/g, ' ')}
              </label>
              <textarea
                value={setting.value}
                onChange={(event) => onChange(setting.key, event.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface resize-none outline-none min-h-24"
                placeholder={`Enter ${setting.key}...`}
              />
            </div>
          ))}

          <div className="pt-6">
            <button
              onClick={saveAll}
              disabled={saving}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">
                {saving ? "sync" : "save"}
              </span>
              {saving ? "Saving Changes..." : "Commit All Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Section */}
      <MarqueeManager />
    </div>
  );
}
