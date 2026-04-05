import { db } from "@/lib/db";
import { SITE_SETTING_DEFAULTS, type SiteSettingsMap } from "@/lib/site-settings-defaults";

export function parseGallery(gallery: string) {
  return gallery
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function encodeGallery(gallery: string[] | string | undefined) {
  if (!gallery) return "";
  if (typeof gallery === "string") return gallery;
  return gallery.map((value) => value.trim()).filter(Boolean).join(",");
}

export async function getSiteSettingsMap(): Promise<SiteSettingsMap> {
  const settings = await db.siteSetting.findMany();
  const map: SiteSettingsMap = { ...SITE_SETTING_DEFAULTS };

  for (const entry of settings) {
    map[entry.key] = entry.value;
  }

  return map;
}

export async function ensureDefaultSiteSettings() {
  await Promise.all(
    Object.entries(SITE_SETTING_DEFAULTS).map(([key, value]) =>
      db.siteSetting.upsert({
        where: { key },
        update: {},
        create: {
          key,
          value,
          type: "text",
          description: "Temple site content",
        },
      }),
    ),
  );
}
