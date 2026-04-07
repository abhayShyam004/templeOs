"use client";

import { useEffect, useState } from "react";
import { CloudinaryUploadButton } from "@/components/admin/cloudinary-upload-button";
import { SITE_SETTING_DEFAULTS } from "@/lib/site-settings-defaults";
import { MarqueeManager } from "./_components/marquee-manager";

type Setting = {
  key: string;
  value: string;
  type?: string;
  description?: string;
};

type AdminSettingsClientProps = {
  uploadPreset?: string;
};

function isImageSetting(key: string) {
  return key.includes("image");
}

export function AdminSettingsClient({ uploadPreset }: AdminSettingsClientProps) {
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
      <section>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
          Site Configuration
        </h1>
        <p className="max-w-3xl text-base font-medium text-on-surface-variant md:text-lg">
          Update homepage text, hero imagery, and temple contact details.
        </p>
      </section>

      <div className="rounded-xl border border-outline-variant bg-surface p-4 shadow-sm md:p-8">
        <div className="mb-6 flex items-center justify-between md:mb-8">
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
                {setting.key.replace(/_/g, " ")}
              </label>

              {isImageSetting(setting.key) ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <CloudinaryUploadButton
                      buttonLabel="Upload Image"
                      className="rounded-lg border border-outline-variant bg-surface-container px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container-high"
                      onUploaded={(url) => onChange(setting.key, url)}
                      uploadPreset={uploadPreset}
                    />
                    {setting.value && (
                      <button
                        type="button"
                        onClick={() => onChange(setting.key, "")}
                        className="rounded-lg border border-outline-variant px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:text-error"
                      >
                        Clear Image
                      </button>
                    )}
                  </div>
                  <input
                    value={setting.value}
                    onChange={(event) => onChange(setting.key, event.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface outline-none"
                    placeholder={`Enter ${setting.key}...`}
                  />
                  {setting.value && (
                    <img
                      src={setting.value}
                      alt={`${setting.key} preview`}
                      className="h-40 w-full rounded-lg border border-outline-variant object-cover md:w-72"
                    />
                  )}
                </div>
              ) : (
                <textarea
                  value={setting.value}
                  onChange={(event) => onChange(setting.key, event.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface resize-none outline-none min-h-24"
                  placeholder={`Enter ${setting.key}...`}
                />
              )}
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

      <MarqueeManager />
    </div>
  );
}
